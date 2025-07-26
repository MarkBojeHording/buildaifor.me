class ProductMatcher {
  constructor(products, categories) {
    this.products = products || [];
    this.categories = categories || [];
  }

  async findProducts(entities, searchQuery) {
    const results = [];
    // Direct entity matches
    entities.forEach(entity => {
      if (entity.type === 'PRODUCT' && entity.id) {
        const product = this.products.find(p => p.id === entity.id);
        if (product) results.push({ ...product, matchScore: entity.confidence });
      }
    });
    // Fuzzy search
    const queryWords = searchQuery.toLowerCase().split(' ');
    this.products.forEach(product => {
      let score = 0;
      const productWords = product.name.toLowerCase().split(' ');
      queryWords.forEach(qWord => {
        productWords.forEach(pWord => {
          if (pWord.includes(qWord) || qWord.includes(pWord)) {
            score += qWord.length > 3 ? 2 : 1;
          }
        });
      });
      if (score > 0) {
        results.push({ ...product, matchScore: score / 10 });
      }
    });
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  async getProductsByCategory(categoryName) {
    return this.products.filter(product =>
      product.category && product.category.toLowerCase() === categoryName.toLowerCase()
    );
  }
}

module.exports = { ProductMatcher };
