<script setup>
import { ref } from 'vue'

const productName = ref('')
const productDescription = ref('')
const productImage = ref(null)

const formMessage = ref('')
const isSubmitting = ref(false)

const handleImageChange = (event) => {
  const file = event.target.files[0] || null

  productImage.value = file

  console.log('Selected image:', file)

  if (file) {
    console.log('Image name:', file.name)
    console.log('Image type:', file.type)
    console.log('Image size:', file.size)
  }
}

const addProduct = async () => {
  console.log('--- addProduct started ---')

  formMessage.value = ''

  if (!productName.value.trim()) {
    console.warn('Product name validation failed.')

    formMessage.value = 'Product name is required.'
    return
  }

  isSubmitting.value = true

  try {
    console.log('Building FormData...')

    const formData = new FormData()

    formData.append('name', productName.value)
    formData.append('description', productDescription.value)

    if (productImage.value) {
      formData.append('image', productImage.value)
    }

    console.log('FormData contents:')

    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    console.log('Sending POST request...')

    const response = await fetch('/.netlify/functions/products', {
      method: 'POST',
      body: formData
    })

    console.log('Response received.')
    console.log('HTTP status:', response.status)
    console.log('HTTP status text:', response.statusText)
    console.log('Response OK:', response.ok)

    const responseText = await response.text()

    console.log('Raw response body:', responseText)

    let data = null

    try {
      data = JSON.parse(responseText)

      console.log('Parsed response JSON:', data)
    } catch (parseError) {
      console.error('Response was not valid JSON:', parseError)
    }

    if (!response.ok) {
      console.error('Backend request failed:', {
        status: response.status,
        statusText: response.statusText,
        responseText,
        data
      })

      throw new Error(
        data?.error ||
        responseText ||
        `Unable to add product. HTTP ${response.status}`
      )
    }

    console.log('Product added successfully:', data)

    formMessage.value = `Added "${data.name}" successfully.`

    productName.value = ''
    productDescription.value = ''
    productImage.value = null

    const imageInput = document.getElementById('product-image')

    if (imageInput) {
      imageInput.value = ''
    }
  } catch (error) {
    console.error('addProduct failed:', error)

    formMessage.value = error.message
  } finally {
    console.log('--- addProduct finished ---')

    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="product-div">

    <div class="title-div">
      Products
    </div>

    <div class="products-update-message">
      We're actively adding more products and features to this page.
      Check back soon for more CandyRific products and updates.
    </div>

    <!-- ========================================
         ADD PRODUCT FORM
    ========================================= -->

    <!-- <form
      class="add-product-form"
      @submit.prevent="addProduct"
    >

      <div class="form-group">
        <label for="product-name">
          Product Name
        </label>

        <input
          id="product-name"
          v-model="productName"
          type="text"
          placeholder="Product name"
        >
      </div>

      <div class="form-group">
        <label for="product-description">
          Description
        </label>

        <textarea
          id="product-description"
          v-model="productDescription"
          placeholder="Product description"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="product-image">
          Product Image
        </label>

        <input
          id="product-image"
          type="file"
          accept="image/*"
          @change="handleImageChange"
        >
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Product' }}
      </button>

      <p
        v-if="formMessage"
        class="form-message"
      >
        {{ formMessage }}
      </p>

    </form> -->

    <!-- ========================================
         PRODUCT GRID
    ========================================= -->

    <div class="product-section">

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14174 Disney Helicopter Fan Display front.webp"
            alt="Disney Helicopter Fan"
          >
        </div>

        <div class="product-text-div">
          Disney Assorted Candy Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/11928 Marvel Candy Fan Display.webp"
            alt="Marvel Candy Fan"
          >
        </div>

        <div class="product-text-div">
          Marvel Avengers Assorted Character Fans
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/17466 HelicopterFan_Display.webp"
            alt="Helicopter Fan Display"
          >
        </div>

        <div class="product-text-div">
          CandyRific Light Up Helicopter Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/16113 SweetSquad_12ctDisplay.webp"
            alt="Sweet Squad 12 Count Display"
          >
        </div>

        <div class="product-text-div">
          CandyRific Sweet Squad Fans
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14604 Licensed Assorted Sweet Spinz Fan HIRES.webp"
            alt="Licensed Assorted Sweet Spinz Fan"
          >
        </div>

        <div class="product-text-div">
          Licensed Assorted Sweet Spinz Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/13676 Spongebob Stretch-eez HIRES.webp"
            alt="SpongeBob Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Nickelodeon SpongeBob Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14529 Stitch Stretch-eez card.webp"
            alt="Stitch Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Disney Stitch Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/13706 Shrek_Stretcheez_BlisterCard.webp"
            alt="Shrek Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Universal Shrek Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/94034_10ct_WH_ED_LMB.webp"
            alt="Warheads Loud Mouth Bites"
          >
        </div>

        <div class="product-text-div">
          Warheads 10ct. Loud Mouth Bites Peg Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/96566 Warheads_4pkPopping Candy_Peg Bag.webp"
            alt="Warheads Popping Candy"
          >
        </div>

        <div class="product-text-div">
          Warheads 4pk. Popping Candy Peg Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/97739-HI WarHeads 40ct. Popping Candy Gusset Bag 3.17oz.webp"
            alt="Warheads 40 Count Popping Candy Gusset Bag"
          >
        </div>

        <div class="product-text-div">
          Warheads SOUR 40ct. Popping Candy Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/16202 Kool-Aid 10ct. Loud Mouth Bites Peg Bag unit render.webp"
            alt="Kool-Aid Loud Mouth Bites"
          >
        </div>

        <div class="product-text-div">
          Kool-Aid 10ct. Loud Mouth Bites Peg Bag
          <br>
          COMING SOON
          <br>
          Available October 15, 2026
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/19856 Kool-Aid Bubblegum Cotton Candy Peg Bag.webp"
            alt="Kool-Aid Bubblegum Cotton Candy"
          >
        </div>

        <div class="product-text-div">
          Kool-Aid Cotton Candy Bubble Gum Peg Bag
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>

.product-div {
  background: #e6f4fd;
  color: #1c8bc3;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   UPDATE MESSAGE
======================================== */

.products-update-message {
  width: min(90%, 50rem);

  margin: 0 auto clamp(1.5rem, 3vw, 2.5rem);
  padding: 0 1rem;

  text-align: center;

  color: #703795;

  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 300;
}


/* ========================================
   ADD PRODUCT FORM
======================================== */

.add-product-form {
  width: min(90%, 40rem);

  margin: 0 auto clamp(2rem, 4vw, 4rem);
  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;
}

.form-group {
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;

  gap: 0.4rem;
}

.form-group label {
  color: #703795;

  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;

  padding: 0.75rem;

  font: inherit;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-group input[type="file"] {
  background: white;

  color: black;

  cursor: pointer;
}

.add-product-form button {
  padding: 0.75rem 1.25rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.add-product-form button:hover {
  opacity: 0.9;
}

.add-product-form button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.form-message {
  margin-top: 1rem;

  color: #703795;
}


/* ========================================
   PRODUCT GRID
======================================== */

.product-section {
  padding: clamp(1rem, 4vw, 4rem);

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: clamp(0.5rem, 1.5vw, 1rem);
}


/* ========================================
   PRODUCT CARD
======================================== */

.product-card-parent {
  min-width: 0;

  border-radius: 10px;
}

.product-card {
  height: clamp(10rem, 22vw, 15rem);

  background: white;

  border-radius: 10px;

  overflow: hidden;
}

.product-card:active {
  box-shadow: none;
}

.product-card img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   PRODUCT TEXT
======================================== */

.product-text-div {
  padding: clamp(0.5rem, 1vw, 0.85rem);

  text-align: center;

  color: black;

  font-size: clamp(0.9rem, 1.25vw, 1.2rem);
  line-height: clamp(1.25rem, 1.7vw, 1.65rem);
  font-weight: 400;
}


/* ========================================
   FILTERS
======================================== */

.product-filter-text {
  margin: 0.5rem;

  text-align: left;

  font-size: clamp(0.9rem, 1vw, 1.1rem);
  line-height: 1.4;
}

.product-filter {
  display: flex;

  gap: 1rem;

  padding: 1rem;

  overflow-x: auto;

  background: linear-gradient(
    90deg,
    #39a4da 0%,
    #027dc3 100%
  );
}

.product-filter-option {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  max-height: 30px;

  padding: 1rem;

  background: #e9faff;

  border-radius: 5px;

  white-space: nowrap;

  font-size: clamp(0.9rem, 1vw, 1.1rem);
}

.product-filter-option:hover {
  background: rgba(0, 0, 0, 0.05);

  color: white;

  border: 1px solid white;
}

.plus-icon {
  font-weight: 700;
}


/* ========================================
   VIEW / LOAD MORE
======================================== */

.view-count-div {
  text-align: center;

  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.5;
}

.load-more-div {
  display: flex;
  justify-content: center;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .product-section {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

}

</style>