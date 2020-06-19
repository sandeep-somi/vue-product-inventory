var eventBus = new Vue();

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">

      <div class="product-image">
        <img :src="image">
      </div>
      <div class="product-info">
        <div style="display: flex;">
          <h1>{{ title }}</h1>
          <span v-if="onSale" style="color: red">On Sale</span>
        </div>
        <p v-if="inStock > 10">In Stock</p>
        <p v-else-if="inStock <= 10 && inStock > 0">Almost sold out!</p>
        <p v-else :class="{ lineThrough: !inStock}">Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div v-for="(variant, index) in variants" :key="variant.id" class="color-box" :style="{ backgroundColor: variant.color }" @mouseover="updateProduct(index)">
        </div>
        <div class="sizes-wrappper">
          <div v-for="(size, index) in sizes" :key="index">{{ size }}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button @click="addToCart">Add to Cart</button>
        </div>
      </div>
      <review-tabs :reviews="reviews"></review-tabs>
    </div>
  `,
  data() {
    return {
      product: 'Boots',
      brand: 'Vue Mastery',
      selected: 0,
      details: [
        "80% Cotton",
        "20% Ployester",
        "Gender-neutral"
      ],
      variants: [
        {
          id: 2234,
          color: "green",
          img: 'src/assets/images/green-socks.png',
          quantity: 5,
          onSale: true
        },
        {
          id: 2235,
          color: "blue",
          img: 'src/assets/images/blue-socks.png',
          quantity: 10,
          onSale: false
        }
      ],
      sizes: ["XS", "SM", "MD", "LG", "XL"],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selected].id);
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selected].id);
    },
    updateProduct(index) {
      this.selected = index
    },
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selected].img
    },
    inStock() {
      return this.variants[this.selected].quantity
    },
    onSale() {
      return this.variants[this.selected].onSale
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return "$2.99"
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    })
  }
})

Vue.component('info-tabs', {
  props: {

  },
  template: `
  
  `,
  data() {

  }
})

Vue.component('review-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div style="padding: 16px;">
      <span class="tab" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab" :class="{ activeTab: selectedTab === tab}" style="margin-bottom: 16px;">{{ tab }}</span>
      

      <div v-show="selectedTab === 'Reviews'" style="border-top: 1px solid #eee; margin-top: 16px;">
        <div>
          <p v-if="!reviews.length">There are no reviews yet!</p>
          <div v-else>
            <div v-for="(review, index) in reviews" :key="index" class="review-container">
              <label><b>{{review.name}}</b></label>
              <p>{{review.review}}</p>
              <p>Rating: {{review.rating}}</p>
            </div>
          </div>
        </div>
      </div>

      <productReview v-show="selectedTab === 'Make a Review'" style="margin-top: 16px;"></productReview>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('productReview', {
  template: `
    <form @submit.prevent="onSubmit">
      <div class="review-form-wrapper">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
        <div>
          <label>Name</label>
          <input v-model="name" />
        </div>
        <div>
          <label>Review</label>
          <textarea id="review" v-model="review" />
        </div>
        <div>
          <label>Rating</label>
          <select v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </div>
        <div>
          <p>Would you recommend this product?</p>
          <label style="display: flex; align-items: center;">
            <input type="checkbox" style="width: 16px; margin-right: 10px;" v-model="recommend">
            Yes
          </label>
        </div>
        <button>Submit</button>
      </div>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: true,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) {
          this.errors.push("Name is required!");
        }
        if (!this.review) {
          this.errors.push("Review is required!");
        }
        if (!this.rating) {
          this.errors.push("Rating is required!");
        }
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      if (this.cart.includes(id)) {
        let updatedCart = [...this.cart].filter(item => item !== id);
        this.cart = updatedCart
      } else {
        this.cart.push(id)
      }
    }
  }
})