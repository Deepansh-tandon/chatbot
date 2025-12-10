import { Package, Eye } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  review_submitted: 'bg-green-100 text-green-700'
};

const PAYMENT_COLORS = {
  pending: 'text-yellow-600',
  partial: 'text-orange-600',
  completed: 'text-green-600'
};

export function OrderCard({ order }) {
  const {
    orderId,
    productName,
    imageURL,
    totalAmount,
    status,
    statusLabel,
    paymentStatus,
    paymentStatusLabel
  } = order;

  const statusColor = STATUS_COLORS[status] || 'bg-neutral-100 text-neutral-700';
  const paymentColor = PAYMENT_COLORS[paymentStatus] || 'text-neutral-600';

  const shortOrderId = orderId ? `#${orderId.split('_').pop()?.slice(-4) || orderId.slice(-4)}` : '';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 w-full max-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="h-4 w-4 text-green-600" />
          </div>
          <span className={`text-sm font-medium px-2 py-0.5 rounded ${statusColor}`}>
            {statusLabel || status}
          </span>
        </div>
        <span className="text-neutral-400 text-sm">{shortOrderId}</span>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="flex gap-3">
          {imageURL ? (
            <img
              src={imageURL}
              alt={productName}
              className="w-16 h-16 rounded-lg object-cover bg-neutral-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/64?text=No+Image';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-neutral-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-neutral-900 text-sm line-clamp-2">
              {productName}
            </h3>
            {totalAmount > 0 && (
              <p className="text-neutral-500 text-sm mt-1">
                Total: ₹{totalAmount}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-neutral-100 bg-neutral-50">
        <div className="text-sm">
          <span className="text-neutral-500">Status: </span>
          <span className={`font-medium ${paymentColor}`}>
            {paymentStatusLabel || paymentStatus || 'Pending'}
          </span>
        </div>
        <button className="flex items-center gap-1 bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
          <Eye className="h-4 w-4" />
          View
        </button>
      </div>
    </div>
  );
}



