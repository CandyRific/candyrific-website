<script setup>
import {
  computed,
  ref
} from 'vue'

/* ========================================
   FORM STATE
======================================== */

const formRef = ref(null)

const customerType = ref('Consumer')
const subject = ref('Customer Feedback')

const firstName = ref('')
const lastName = ref('')
const email = ref('')

const companyName = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')

const message = ref('')

/* ========================================
   NETLIFY FORM
======================================== */

const netlifyFormName = computed(() => {
  return customerType.value === 'Consumer'
    ? 'customer_form'
    : 'sales_form'
})

/* ========================================
   FORM OPTIONS
======================================== */

const customerTypes = [
  'Consumer',
  'Distributor',
  'Retail Store'
]

const subjects = [
  'Customer Feedback',
  'Sales - International',
  'Sales - USA'
]

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]

/* ========================================
   SUBMISSION STATE
======================================== */

const isSubmitting = ref(false)

const formMessage = ref('')
const formSuccess = ref(false)

/* ========================================
   RESET FORM
======================================== */

const resetForm = () => {
  customerType.value = 'Consumer'
  subject.value = 'Customer Feedback'

  firstName.value = ''
  lastName.value = ''
  email.value = ''

  companyName.value = ''
  address.value = ''
  city.value = ''
  state.value = ''
  zipCode.value = ''

  message.value = ''
}

/* ========================================
   SUBMIT FORM
======================================== */

const handleSubmit = async () => {
  isSubmitting.value = true

  formMessage.value = ''
  formSuccess.value = false

  try {
    const formData =
      new FormData(formRef.value)

    const encodedData =
      new URLSearchParams()

    for (
      const [key, value]
      of formData.entries()
    ) {
      encodedData.append(
        key,
        value.toString()
      )
    }

    const response = await fetch(
      '/',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        },

        body: encodedData.toString()
      }
    )

    if (!response.ok) {
      throw new Error(
        'Unable to submit contact form.'
      )
    }

    formSuccess.value = true

    formMessage.value =
      'Thanks for reaching out! Your message was sent successfully. Someone from CandyRific will be in contact with you soon.'

    resetForm()
  } catch (error) {
    console.error(
      'Contact form submission failed:',
      error
    )

    formSuccess.value = false

    formMessage.value =
      'We had trouble sending your message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="contact-view">
    <!-- =====================================
         PAGE INTRO
    ====================================== -->

    <div class="contact-heading">
      <div class="heading-accent">
        LET'S TALK
      </div>

      <h1 class="section-title">
        Contact Us
      </h1>

      <p class="section-description">
        Have a question, some feedback, or want
        to talk CandyRific? Fill out the form
        below and we'll make sure your message
        gets to the right place.
      </p>
    </div>


    <!-- =====================================
         FORM
    ====================================== -->

    <form
      ref="formRef"
      :name="netlifyFormName"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      class="contact-form"
      @submit.prevent="handleSubmit"
    >
      <input
        type="hidden"
        name="form-name"
        :value="netlifyFormName"
      />

      <div class="honeypot-field">
        <label>
          Do not fill this out:
          <input
            name="bot-field"
            type="text"
            tabindex="-1"
            autocomplete="off"
          />
        </label>
      </div>

      <!-- =====================================
           TOP SELECTIONS
      ====================================== -->

      <div class="form-section">
        <div class="form-section-heading">
          <span class="section-number">
            1
          </span>

          <div>
            <h2>
              Tell us a little about you
            </h2>

            <p>
              This helps us route your message
              to the right people.
            </p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="customer-type">
              Select Which Describes You Best
            </label>

            <div class="select-wrapper">
              <select
                id="customer-type"
                v-model="customerType"
                name="customerType"
                required
              >
                <option
                  v-for="type in customerTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="subject">
              Subject
            </label>

            <div class="select-wrapper">
              <select
                id="subject"
                v-model="subject"
                name="contactSubject"
                required
              >
                <option
                  v-for="
                    subjectOption in subjects
                  "
                  :key="subjectOption"
                  :value="subjectOption"
                >
                  {{ subjectOption }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- =====================================
           CONTACT INFORMATION
      ====================================== -->

      <div class="form-section">
        <div class="form-section-heading">
          <span class="section-number blue">
            2
          </span>

          <div>
            <h2>
              Your information
            </h2>

            <p>
              Let us know how we can reach you.
            </p>
          </div>
        </div>

        <div class="form-columns">
          <!-- LEFT COLUMN -->

          <div class="form-column">
            <div class="form-field">
              <label for="first-name">
                First Name

                <span class="required">
                  *
                </span>
              </label>

              <input
                id="first-name"
                v-model="firstName"
                type="text"
                name="firstName"
                autocomplete="given-name"
                required
              />
            </div>

            <div class="form-field">
              <label for="last-name">
                Last Name

                <span class="required">
                  *
                </span>
              </label>

              <input
                id="last-name"
                v-model="lastName"
                type="text"
                name="lastName"
                autocomplete="family-name"
                required
              />
            </div>

            <div class="form-field">
              <label for="email">
                Email

                <span class="required">
                  *
                </span>
              </label>

              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                required
              />
            </div>

            <div class="small-divider"></div>

            <div class="form-field">
              <label for="company-name">
                Company Name
              </label>

              <input
                id="company-name"
                v-model="companyName"
                type="text"
                name="companyName"
                autocomplete="organization"
              />
            </div>

            <div class="form-field">
              <label for="address">
                Address
              </label>

              <span class="field-note">
                If you're a consumer, use your
                personal address.
              </span>

              <input
                id="address"
                v-model="address"
                type="text"
                name="address"
                autocomplete="street-address"
              />
            </div>

            <div class="form-field">
              <label for="city">
                City
              </label>

              <input
                id="city"
                v-model="city"
                type="text"
                name="city"
                autocomplete="address-level2"
              />
            </div>

            <div class="state-zip-row">
              <div class="form-field">
                <label for="state">
                  State
                </label>

                <div class="select-wrapper">
                  <select
                    id="state"
                    v-model="state"
                    name="state"
                    autocomplete="address-level1"
                  >
                    <option value="">
                      Choose...
                    </option>

                    <option
                      v-for="
                        stateName in states
                      "
                      :key="stateName"
                      :value="stateName"
                    >
                      {{ stateName }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label for="zip-code">
                  Zip Code
                </label>

                <input
                  id="zip-code"
                  v-model="zipCode"
                  type="text"
                  name="zipCode"
                  autocomplete="postal-code"
                />
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->

          <div class="form-column right-column">
            <div class="form-field message-field">
              <label for="message">
                Message

                <span class="required">
                  *
                </span>
              </label>

              <textarea
                id="message"
                v-model="message"
                name="message"
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
            >
              <span>
                {{
                  isSubmitting
                    ? 'Sending...'
                    : 'Send Message'
                }}
              </span>

              <span
                v-if="!isSubmitting"
                class="button-arrow"
              >
                →
              </span>
            </button>

            <div
  v-if="formMessage"
  class="form-message"
  :class="{
    success: formSuccess,
    error: !formSuccess
  }"
  role="status"
  aria-live="polite"
>
  <div class="form-message-icon">
    {{ formSuccess ? '✓' : '!' }}
  </div>

  <span>
    {{ formMessage }}
  </span>
</div>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
/* ========================================
   PAGE
======================================== */

.contact-view {
  width: min(90%, 70rem);

  margin: 0 auto;
  padding: 2.5rem 0 5rem;

  font-family: 'Fredoka', sans-serif;
}

/* ========================================
   HEADING
======================================== */

.contact-heading {
  margin-bottom: 2rem;
}

.heading-accent {
  width: fit-content;

  margin-bottom: 0.4rem;

  color: #f04d86;

  font-size: 0.9rem;
  font-weight: 600;

  letter-spacing: 0.12rem;
}

.section-title {
  margin: 0;

  color: #703795;

  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 600;

  line-height: 1;
}

.section-description {
  max-width: 42rem;

  margin: 0.85rem 0 0;

  color: #444;

  font-size: 1.05rem;
  line-height: 1.55;
}

/* ========================================
   MAIN FORM
======================================== */

.contact-form {
  width: 100%;
}

/* ========================================
   FORM SECTIONS
======================================== */

.form-section {
  position: relative;

  margin-bottom: 1.5rem;
  padding: 1.75rem;

  background: white;

  border: 2px solid #eee8f1;
  border-radius: 14px;

  box-shadow:
    0 5px 16px
    rgba(112, 55, 149, 0.07);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.form-section:hover {
  border-color: #d8c5e4;

  box-shadow:
    0 8px 22px
    rgba(112, 55, 149, 0.1);
}

.form-section::before {
  content: '';

  position: absolute;

  top: 0;
  left: 1.5rem;
  right: 1.5rem;

  height: 4px;

  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #f04d86 50%,
      #01aef0 100%
    );

  border-radius: 0 0 4px 4px;
}

/* ========================================
   SECTION HEADINGS
======================================== */

.form-section-heading {
  margin-bottom: 1.5rem;

  display: flex;
  align-items: center;

  gap: 0.8rem;
}

.section-number {
  width: 2.5rem;
  height: 2.5rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #703795;

  color: white;

  border-radius: 50%;

  font-size: 1.1rem;
  font-weight: 600;

  box-shadow:
    0 4px 0
    #51236e;
}

.section-number.blue {
  background: #01aef0;

  box-shadow:
    0 4px 0
    #0088bb;
}

.form-section-heading h2 {
  margin: 0;

  color: #703795;

  font-size: 1.25rem;
  font-weight: 600;
}

.form-section-heading p {
  margin: 0.1rem 0 0;

  color: #777;

  font-size: 0.9rem;
}

/* ========================================
   LAYOUT
======================================== */

.form-row,
.form-columns {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1.5rem;
}

.form-column {
  min-width: 0;
}

.right-column {
  display: flex;
  flex-direction: column;
}

/* ========================================
   FORM FIELDS
======================================== */

.form-field {
  width: 100%;

  margin-bottom: 1rem;
}

.form-field label {
  display: block;

  margin-bottom: 0.35rem;

  color: #3b3b3b;

  font-size: 1rem;
  font-weight: 500;
}

.required {
  color: #f04d86;
}

.field-note {
  display: block;

  margin-top: -0.2rem;
  margin-bottom: 0.4rem;

  color: #777;

  font-size: 0.82rem;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;

  box-sizing: border-box;

  background: white;

  color: #333;

  border: 2px solid #ddd6e1;
  border-radius: 8px;

  outline: none;

  font: inherit;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.form-field input,
.form-field select {
  min-height: 3.1rem;

  padding: 0.7rem 0.85rem;
}

.form-field textarea {
  min-height: 31rem;

  padding: 0.85rem;

  resize: vertical;

  line-height: 1.5;
}

.form-field textarea::placeholder {
  color: #aaa;
}

.form-field input:hover,
.form-field select:hover,
.form-field textarea:hover {
  border-color: #bda9c9;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: #703795;

  box-shadow:
    0 0 0 3px
    rgba(112, 55, 149, 0.1);
}

/* ========================================
   SELECT
======================================== */

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';

  position: absolute;

  top: 50%;
  right: 1rem;

  width: 0.55rem;
  height: 0.55rem;

  border-right: 3px solid #703795;
  border-bottom: 3px solid #703795;

  pointer-events: none;

  transform:
    translateY(-65%)
    rotate(45deg);
}

.select-wrapper select {
  appearance: none;

  padding-right: 2.8rem;

  color: #703795;

  cursor: pointer;
}

/* ========================================
   DIVIDER
======================================== */

.small-divider {
  height: 2px;

  margin: 0.4rem 0 1.5rem;

  background:
    linear-gradient(
      90deg,
      #703795,
      #f04d86,
      transparent
    );

  border-radius: 10px;

  opacity: 0.3;
}

/* ========================================
   STATE / ZIP
======================================== */

.state-zip-row {
  display: grid;

  grid-template-columns:
    1.2fr 1fr;

  gap: 1rem;
}

/* ========================================
   MESSAGE
======================================== */

.message-field {
  flex: 1;

  display: flex;
  flex-direction: column;
}

.message-field textarea {
  flex: 1;
}

/* ========================================
   SUBMIT BUTTON
======================================== */

.submit-button {
  width: 100%;

  min-height: 3.8rem;

  margin-top: auto;
  padding: 0.9rem 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.7rem;

  background:
    linear-gradient(
      110deg,
      #703795 0%,
      #8c42a7 45%,
      #f04d86 100%
    );

  background-size: 160% 100%;

  color: white;

  border: none;
  border-radius: 8px;

  font: inherit;
  font-size: 1.05rem;
  font-weight: 600;

  cursor: pointer;

  box-shadow:
    0 5px 0
    #51236e;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-position 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);

  background-position: 100% 0;

  box-shadow:
    0 7px 0
    #51236e;
}

.submit-button:active:not(:disabled) {
  transform: translateY(3px);

  box-shadow:
    0 2px 0
    #51236e;
}

.submit-button:disabled {
  opacity: 0.65;

  cursor: wait;
}

.button-arrow {
  font-size: 1.4rem;

  transition: transform 0.2s ease;
}

.submit-button:hover .button-arrow {
  transform: translateX(4px);
}

/* ========================================
   FORM RESPONSE
======================================== */

.form-message {
  margin-bottom: 1.5rem;
  padding: 1rem 1.2rem;

  display: flex;
  align-items: center;

  gap: 0.8rem;

  border: 2px solid;
  border-radius: 10px;

  font-size: 0.95rem;
  line-height: 1.4;
}

.form-message.success {
  background: #f5eff8;

  color: #703795;
margin-top: 1rem;
  border-color: #703795;
}

.form-message.error {
  background: #fff3f7;

  color: #c42c61;

  border-color: #f04d86;
}

.form-message-icon {
  width: 1.9rem;
  height: 1.9rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #703795;

  color: white;

  border-radius: 50%;

  font-weight: 600;
}

.form-message.error .form-message-icon {
  background: #f04d86;
}

/* ========================================
   HONEYPOT
======================================== */

.honeypot-field {
  position: absolute;

  width: 1px;
  height: 1px;

  overflow: hidden;

  clip: rect(0 0 0 0);

  white-space: nowrap;
}

/* ========================================
   TABLET / MOBILE
======================================== */

@media (max-width: 800px) {
  .contact-view {
    width: min(92%, 40rem);

    padding-top: 2rem;
  }

  .form-section {
    padding: 1.4rem;
  }

  .form-row,
  .form-columns {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .form-row .form-field:last-child {
    margin-bottom: 0;
  }

  .right-column {
    margin-top: 0.5rem;
  }

  .form-field textarea {
    min-height: 16rem;
  }
}

/* ========================================
   SMALL MOBILE
======================================== */

@media (max-width: 500px) {
  .contact-view {
    width: 92%;

    padding-bottom: 3rem;
  }

  .section-title {
    font-size: 2.6rem;
  }

  .section-description {
    font-size: 0.98rem;
  }

  .form-section {
    padding: 1.25rem 1rem;

    border-radius: 10px;
  }

  .form-section::before {
    left: 1rem;
    right: 1rem;
  }

  .form-section-heading {
    align-items: flex-start;
  }

  .section-number {
    width: 2.2rem;
    height: 2.2rem;
  }

  .state-zip-row {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .submit-button {
    min-height: 3.5rem;
  }
}
</style>