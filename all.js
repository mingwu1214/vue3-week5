const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// Define validation rules
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

// Load localization messages for traditional Chinese
loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

// Configure localization
configure({
  generateMessage: localize("zh_TW"),
});

// Create Vue app
const app = Vue.createApp({
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2",// API base URL
      path: "mingwu",// API path
      products: [],// Array to store products
      tempProduct: {},// Temporary product object
      cart: {},// Cart object
      isLoading: true,// Loading state
      form: {// Form data for user details and message
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    VForm: Form, // Form component
    VField: Field, // Field component
    ErrorMessage: ErrorMessage, // Error message component
    Loading: VueLoading.Component, // Loading overlay component
  },
  methods: {
    // Method to fetch products data
    getProducts() {
      const url = `${this.url}/api/${this.path}/products`;
      axios
        .get(url)
        .then((response) => {
          this.isLoading = false;
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to view product details
    viewProduct(id) {
      const url = `${this.url}/api/${this.path}/product/${id}`;
      axios
        .get(url)
        .then((res) => {
          this.tempProduct = res.data.product;
          this.$refs.productModal.openModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to add product to cart
    addToCart(id, qty = 1) {
      const url = `${this.url}/api/${this.path}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      this.$refs.productModal.hideModal();
      axios
        .post(url, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to update quantity of a product in cart
    changeNum(item) {
      const url = `${this.url}/api/${this.path}/cart/${item.id}`;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      axios
        .put(url, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to fetch cart data
    getCart() {
      const url = `${this.url}/api/${this.path}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.cart = res.data.data;
          console.log(this.cart);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to delete a product from cart
    deleteProduct(id) {
      const url = `${this.url}/api/${this.path}/cart/${id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to empty cart
    emptyCart() {
      const url = `${this.url}/api/${this.path}/carts`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Method to submit order
    sendOrder() {
      const url = `${this.url}/api/${this.path}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // Custom validation method for phone number
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請輸入正確的電話號碼";
    },
  },
  // Method to run when the component is mounted
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// Define product modal component
app.component("productModal", {
  props: ["product"],// Props received: product
  data() {
    return {
      modal: "",// Modal instance
      qty: "",// Quantity
    };
  },
  template: "#productModal",// Template ID
  methods: {
    // Method to open modal
    openModal() {
      this.modal.show();
    },
    // Method to hide modal
    hideModal() {
      this.modal.hide();
    },
  },
  // Method to run when the component is mounted
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);// Initialize modal
  },
});

app.mount("#app");
