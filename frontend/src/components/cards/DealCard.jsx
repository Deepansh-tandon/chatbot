import { Star, ExternalLink } from 'lucide-react';

export function DealCard({ deal }) {
  const {
    title,
    description,
    price,
    originalPrice,
    discount,
    category,
    source,
    rating,
    imageURL,
    link
  } = deal;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 w-full max-w-[280px]">
      {/* Image */}
      <div className="relative h-36 bg-neutral-100">
        {imageURL ? (
          <img
            src={imageURL}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/280x144?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        {source && (
          <span className="absolute top-2 right-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded">
            {source}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-neutral-900 text-sm line-clamp-2 mb-1">
          {title}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-neutral-600">{rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 font-bold">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-neutral-400 text-sm line-through">₹{originalPrice}</span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Category Tag */}
        {category && (
          <span className="inline-block bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded mb-3">
            {category}
          </span>
        )}

        {/* Action Button */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-neutral-900 text-white text-sm py-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            GET LINK
          </a>
        )}
      </div>
    </div>
  );
}





