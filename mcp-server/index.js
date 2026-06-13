import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

const server = new Server(
  { name: 'queue-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_vendors',
      description: 'List all registered shops/vendors',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'vendor_login',
      description: 'Authenticate a vendor using email/phone and password',
      inputSchema: {
        type: 'object',
        properties: {
          identifier: { type: 'string', description: 'Email or phone number' },
          password: { type: 'string' },
        },
        required: ['identifier', 'password'],
      },
    },
    {
      name: 'list_vendor_services',
      description: 'List all services for a vendor shop',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string', description: 'Vendor ID' },
        },
        required: ['vendorId'],
      },
    },
    {
      name: 'create_vendor_service',
      description: 'Add a new service for a vendor',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
          name: { type: 'string' },
          estimatedTime: { type: 'number', description: 'Duration in minutes' },
          price: { type: 'number' },
        },
        required: ['vendorId', 'name', 'estimatedTime', 'price'],
      },
    },
    {
      name: 'update_vendor_service',
      description: 'Update an existing service',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
          id: { type: 'string', description: 'Service ID' },
          name: { type: 'string' },
          estimatedTime: { type: 'number' },
          price: { type: 'number' },
          active: { type: 'boolean' },
        },
        required: ['vendorId', 'id'],
      },
    },
    {
      name: 'get_queue',
      description: 'Get the current queue for a vendor (active bookings)',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
        },
        required: ['vendorId'],
      },
    },
    {
      name: 'update_queue_status',
      description: 'Update a booking status in the queue',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
          bookingId: { type: 'string', description: 'The booking ID string' },
          status: {
            type: 'string',
            enum: ['confirmed', 'waiting', 'serving', 'completed', 'cancelled'],
          },
        },
        required: ['vendorId', 'bookingId', 'status'],
      },
    },
    {
      name: 'get_analytics',
      description: 'Get analytics data for a vendor',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
        },
        required: ['vendorId'],
      },
    },
    {
      name: 'get_vendor_settings',
      description: 'Get vendor settings/profile',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
        },
        required: ['vendorId'],
      },
    },
    {
      name: 'update_vendor_settings',
      description: 'Update vendor settings',
      inputSchema: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
          whatsappNumber: { type: 'string' },
          notifyBeforeMinutes: { type: 'number' },
          enablePredictions: { type: 'boolean' },
          businessStartTime: { type: 'string', description: 'HH:MM format' },
          businessEndTime: { type: 'string', description: 'HH:MM format' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          pincode: { type: 'string' },
          location: {
            type: 'object',
            properties: { lat: { type: 'number' }, lng: { type: 'number' } },
          },
        },
        required: ['vendorId'],
      },
    },
    {
      name: 'create_booking',
      description: 'Create a new booking/appointment',
      inputSchema: {
        type: 'object',
        properties: {
          shopId: { type: 'string' },
          shopName: { type: 'string' },
          serviceId: { type: 'string' },
          service: { type: 'string', description: 'Service name' },
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          customerEmail: { type: 'string' },
          date: { type: 'string', description: 'ISO date string' },
          time: { type: 'string', description: 'HH:MM format' },
        },
        required: ['shopId', 'serviceId', 'customerName', 'customerPhone', 'date', 'time'],
      },
    },
    {
      name: 'get_bookings',
      description: 'Query bookings with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          shopId: { type: 'string' },
          status: { type: 'string' },
          phone: { type: 'string', description: 'Customer phone number' },
          limit: { type: 'number', default: 10 },
          skip: { type: 'number', default: 0 },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_vendors': {
        const data = await apiFetch('/vendors');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'vendor_login': {
        const data = await apiFetch('/vendors/login', {
          method: 'POST',
          body: JSON.stringify({ identifier: args.identifier, password: args.password }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'list_vendor_services': {
        const data = await apiFetch(`/vendors/${args.vendorId}/services`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'create_vendor_service': {
        const data = await apiFetch(`/vendors/${args.vendorId}/services`, {
          method: 'POST',
          body: JSON.stringify({ name: args.name, estimatedTime: args.estimatedTime, price: args.price }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'update_vendor_service': {
        const body = { id: args.id };
        if (args.name !== undefined) body.name = args.name;
        if (args.estimatedTime !== undefined) body.estimatedTime = args.estimatedTime;
        if (args.price !== undefined) body.price = args.price;
        if (args.active !== undefined) body.active = args.active;
        const data = await apiFetch(`/vendors/${args.vendorId}/services`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_queue': {
        const data = await apiFetch(`/vendors/${args.vendorId}/queue`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'update_queue_status': {
        const data = await apiFetch(`/vendors/${args.vendorId}/queue`, {
          method: 'PUT',
          body: JSON.stringify({ bookingId: args.bookingId, status: args.status }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_analytics': {
        const data = await apiFetch(`/vendors/${args.vendorId}/analytics`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_vendor_settings': {
        const data = await apiFetch(`/vendors/${args.vendorId}/settings`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'update_vendor_settings': {
        const body = {};
        for (const key of ['whatsappNumber', 'notifyBeforeMinutes', 'enablePredictions',
          'businessStartTime', 'businessEndTime', 'address', 'city', 'state', 'pincode', 'location']) {
          if (args[key] !== undefined) body[key] = args[key];
        }
        const data = await apiFetch(`/vendors/${args.vendorId}/settings`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'create_booking': {
        const data = await apiFetch('/bookings', {
          method: 'POST',
          body: JSON.stringify({
            shopId: args.shopId,
            shopName: args.shopName,
            serviceId: args.serviceId,
            service: args.service,
            customerName: args.customerName,
            customerPhone: args.customerPhone,
            customerEmail: args.customerEmail,
            date: args.date,
            time: args.time,
          }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_bookings': {
        const params = new URLSearchParams();
        if (args.shopId) params.set('shopId', args.shopId);
        if (args.status) params.set('status', args.status);
        if (args.phone) params.set('phone', args.phone);
        if (args.limit) params.set('limit', String(args.limit));
        if (args.skip) params.set('skip', String(args.skip));
        const qs = params.toString();
        const data = await apiFetch(`/bookings${qs ? `?${qs}` : ''}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
