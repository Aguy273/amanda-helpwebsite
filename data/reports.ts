import type { Report } from '@/types'

export const dummyReports: Report[] = [
  {
    id: '1',
    title: 'Server Down Issue',
    description: 'Main server is not responding',
    status: 'pending',
    createdBy: '2',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Email Configuration',
    description: 'Setup new email accounts for team',
    status: 'in-progress',
    createdBy: '2',
    createdAt: '2024-01-14T14:30:00Z',
    assignedTo: '1'
  },
  {
    id: '3',
    title: 'Database Backup',
    description: 'Weekly database backup completed',
    status: 'completed',
    createdBy: '2',
    createdAt: '2024-01-13T09:15:00Z',
    assignedTo: '1'
  },
  {
    id: '4',
    title: 'Network Maintenance',
    description: 'Scheduled network maintenance',
    status: 'completed',
    createdBy: '2',
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'Software Update',
    description: 'Update all workstation software',
    status: 'in-progress',
    createdBy: '2',
    createdAt: '2024-01-11T11:20:00Z'
  }
]
