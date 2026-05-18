import React from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Building, Calendar, User, Hash, FileText } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadDetailProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}): JSX.Element => (
  <div className="flex items-start gap-3 py-3 border-b border-hairline last:border-0 dark:border-dark-border">
    <div className="flex-shrink-0 mt-0.5 text-mute dark:text-gray-500">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-mute dark:text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-ink dark:text-white break-all">{value}</p>
    </div>
  </div>
);

export const LeadDetail = ({ lead, onEdit, onDelete }: LeadDetailProps): JSX.Element => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-accent/20 dark:from-primary-900/40 dark:to-accent/20 flex items-center justify-center text-primary dark:text-primary-300 text-xl font-semibold">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-ink dark:text-white truncate">{lead.name}</h3>
          <p className="text-sm text-mute dark:text-gray-500 truncate">{lead.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card p-0 divide-y divide-hairline dark:divide-dark-border">
        <DetailRow icon={<Mail size={14} />} label="Email" value={lead.email} />
        {lead.phone && <DetailRow icon={<Phone size={14} />} label="Phone" value={lead.phone} />}
        {lead.company && <DetailRow icon={<Building size={14} />} label="Company" value={lead.company} />}
        <DetailRow
          icon={<Calendar size={14} />}
          label="Created"
          value={format(new Date(lead.createdAt), 'MMMM d, yyyy, h:mm a')}
        />
        {lead.createdAt !== lead.updatedAt && (
          <DetailRow
            icon={<Calendar size={14} />}
            label="Last Updated"
            value={format(new Date(lead.updatedAt), 'MMMM d, yyyy, h:mm a')}
          />
        )}
        {typeof lead.createdBy === 'object' && lead.createdBy && (
          <DetailRow
            icon={<User size={14} />}
            label="Created By"
            value={`${lead.createdBy.name} (${lead.createdBy.email})`}
          />
        )}
        <DetailRow icon={<Hash size={14} />} label="Lead ID" value={lead._id} />
      </div>

      {/* Notes */}
      {lead.notes && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-mute" />
            <p className="text-xs font-medium text-mute dark:text-gray-500 uppercase tracking-wider">Notes</p>
          </div>
          <div className="bg-canvas-soft dark:bg-dark-hover rounded-xl p-4">
            <p className="text-sm text-body dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {lead.notes}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onDelete} className="btn-danger flex-1">
          Delete Lead
        </button>
        <button onClick={onEdit} className="btn-primary flex-1">
          Edit Lead
        </button>
      </div>
    </div>
  );
};
