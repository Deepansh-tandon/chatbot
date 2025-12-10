import Deal from '../models/Deal.js';

export const getAllDeals = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, source, limit = 20 } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category.toLowerCase();
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (source) {
      query.source = source;
    }

    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Deals retrieved successfully',
      count: deals.length,
      data: deals
    });
  } catch (error) {
    next(error);
  }
};

export const getDealById = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findOne({ dealId });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deal retrieved successfully',
      data: deal
    });
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      price, 
      originalPrice,
      discount,
      category,
      source,
      rating,
      link,
      imageURL 
    } = req.body;

    if (!title || price === undefined || !imageURL) {
      return res.status(400).json({
        success: false,
        message: 'Title, price, and imageURL are required'
      });
    }

    let calculatedDiscount = discount || 0;
    if (originalPrice && originalPrice > price && !discount) {
      calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const deal = new Deal({
      title,
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      discount: calculatedDiscount,
      category: category ? category.toLowerCase() : 'general',
      source: source || 'Store',
      rating: rating ? parseFloat(rating) : 0,
      link: link || '',
      imageURL,
      isActive: true
    });

    await deal.save();

    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      data: deal
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const { dealId } = req.params;
    const updateData = req.body;

    if (updateData.category) {
      updateData.category = updateData.category.toLowerCase();
    }

    if (updateData.originalPrice && updateData.price && !updateData.discount) {
      updateData.discount = Math.round(
        ((updateData.originalPrice - updateData.price) / updateData.originalPrice) * 100
      );
    }

    const deal = await Deal.findOneAndUpdate(
      { dealId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deal updated successfully',
      data: deal
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findOneAndUpdate(
      { dealId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Deal.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
