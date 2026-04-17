/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, PipelineStage } from './types';

export const PIPELINE_STAGES: PipelineStage[] = [
  'RFQ Received',
  'Technical Discussion',
  'Quotation Submitted',
  'Negotiation',
  'Order Won',
  'Order Lost'
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    companyName: 'Tata Motors',
    email: 'rajesh.k@tatamotors.com',
    phone: '+91 98765 43210',
    rfqNumber: 'RFQ-TM-2024-001',
    drawingNumber: 'DWG-BUMPER-FR-02',
    partName: 'Front Bumper Checking Fixture',
    projectName: 'Safari Facelift 2024',
    source: 'Website',
    value: 450000,
    followUpDate: '2024-04-20',
    status: 'Quotation Submitted',
    notes: 'Technical discussion completed. Waiting for price negotiation.',
    createdAt: '2024-04-10',
    activities: [
      { id: 'a1', type: 'Call', content: 'Initial RFQ received and confirmed', timestamp: '2024-04-10T10:00:00Z' },
      { id: 'a2', type: 'Meeting', content: 'Technical review with engineering team', timestamp: '2024-04-12T14:30:00Z' }
    ]
  },
  {
    id: '2',
    customerName: 'Amit Shah',
    companyName: 'Mahindra & Mahindra',
    email: 'shah.amit@mahindra.com',
    phone: '+91 98220 12345',
    rfqNumber: 'RFQ-MM-XUV700-09',
    drawingNumber: 'DRW-DOOR-RR-L',
    partName: 'Rear Door Inner Fixture',
    projectName: 'XUV700 EV',
    source: 'Referral',
    value: 320000,
    followUpDate: '2024-04-18',
    status: 'Technical Discussion',
    notes: 'Complex geometry. Need to check sensor mounting points.',
    createdAt: '2024-04-12',
    activities: [
      { id: 'b1', type: 'WhatsApp', content: 'Sent brochure and capability list', timestamp: '2024-04-12T09:15:00Z' }
    ]
  },
  {
    id: '3',
    customerName: 'Sanjay Gupta',
    companyName: 'Maruti Suzuki',
    email: 'sanjay.gupta@maruti.co.in',
    phone: '+91 99000 55000',
    rfqNumber: 'MSIL-2024-88',
    drawingNumber: 'M-DASH-SUB-01',
    partName: 'Dashboard Sub-assembly Gauge',
    projectName: 'Swift Gen 4',
    source: 'Event',
    value: 280000,
    followUpDate: '2024-04-22',
    status: 'RFQ Received',
    notes: 'Received RFQ at Auto Expo. High priority.',
    createdAt: '2024-04-15',
    activities: []
  },
  {
    id: '4',
    customerName: 'Vikram Singh',
    companyName: 'Hero MotoCorp',
    email: 'v.singh@heromotocorp.com',
    phone: '+91 91111 22222',
    rfqNumber: 'HERO-CH-004',
    drawingNumber: 'H-FR-C-02',
    partName: 'Chassis Main Frame Boring Jigs',
    projectName: 'Vida V2',
    source: 'Cold Call',
    value: 520000,
    followUpDate: '2024-04-15',
    status: 'Order Won',
    notes: 'P.O received. Starting procurement.',
    createdAt: '2024-04-05',
    activities: [
      { id: 'c1', type: 'Meeting', content: 'Commercial negotiation closed at ₹5.2L', timestamp: '2024-04-14T11:00:00Z' }
    ]
  }
];
