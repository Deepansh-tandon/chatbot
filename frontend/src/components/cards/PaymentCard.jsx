import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_ICONS = {
  pending: Clock,
  partial: AlertCircle,
  completed: CheckCircle
};

const STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-50',
  partial: 'text-orange-600 bg-orange-50',
  completed: 'text-green-600 bg-green-50'
};

export function PaymentCard({ payment }) {
  const {
    paymentId,
    orderId,
    productName,
    imageURL,
    orderStatus,
    orderStatusLabel,
    totalAmount,
    amountPaid,
    pendingAmount,
    status,
    statusLabel
  } = payment;

  const StatusIcon = STATUS_ICONS[status] || Clock;
  const statusColor = STATUS_COLORS[status] || 'text-neutral-600 bg-neutral-50';

  const shortPaymentId = paymentId ? `#${paymentId.split('_').pop()?.slice(-4) || paymentId.slice(-4)}` : '';
  const shortOrderId = orderId ? `#${orderId.split('_').pop()?.slice(-4) || orderId.slice(-4)}` : '';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 w-full max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColor}`}>
            <StatusIcon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-900">
              {statusLabel || (status === 'completed' ? 'Paid' : status)}
            </span>
          </div>
        </div>
        <span className="text-neutral-400 text-xs">{shortPaymentId}</span>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="flex gap-3">
          {imageURL ? (
            <img
              src={imageURL}
              alt={productName}
              className="w-14 h-14 rounded-lg object-cover bg-neutral-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/56?text=No+Image';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-neutral-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-neutral-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-neutral-900 text-sm line-clamp-1">
              {productName || 'Product'}
            </h3>
            <p className="text-neutral-400 text-xs mt-0.5">
              Order {shortOrderId}
            </p>
            {orderStatusLabel && (
              <span className="inline-block mt-1 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                {orderStatusLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="px-3 pb-3">
        <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Total Amount</span>
            <span className="font-medium text-neutral-900">₹{totalAmount || (amountPaid + pendingAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Paid</span>
            <span className="font-medium text-green-600">₹{amountPaid}</span>
          </div>
          {pendingAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Pending</span>
              <span className="font-medium text-orange-600">₹{pendingAmount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



