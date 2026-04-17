/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeadSource = 'Event' | 'Referral' | 'Website' | 'Cold Call' | 'LinkedIn';

export type PipelineStage = 
  | 'RFQ Received'
  | 'Technical Discussion'
  | 'Quotation Submitted'
  | 'Negotiation'
  | 'Order Won'
  | 'Order Lost';

export type ActivityType = 'Call' | 'WhatsApp' | 'Meeting' | 'Email' | 'Note';

export interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  rfqNumber: string;
  drawingNumber: string;
  partName: string;
  projectName: string;
  source: LeadSource;
  value: number;
  followUpDate: string;
  status: PipelineStage;
  notes: string;
  activities: Activity[];
  createdAt: string;
  attachments?: string[];
}
