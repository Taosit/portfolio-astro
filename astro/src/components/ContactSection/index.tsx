import styles from "./index.module.css";
import Mail from "../../assets/mail.svg";
import Success from "../../assets/success.svg";
import Error from "../../assets/error.svg";
import Trees from "../../assets/trees.svg";
import { createMemo, createSignal } from "solid-js";

export function ContactSection() {
  const [showSuccessMessage, setShowSuccessMessage] = createSignal(false);
  const [showFailureMessage, setShowFailureMessage] = createSignal(false);

  const showSuccessPopup = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const showFailurePopup = () => {
    setShowFailureMessage(true);
    setTimeout(() => {
      setShowFailureMessage(false);
    }, 5000);
  };

  return (
    <section class={`page ${styles.contactPage}`} id="contact">
      <div class="h2-container">
        <h2>Contact Me</h2>
        <div class="h2-icon">
          <img src={Mail} alt="" />
        </div>
      </div>
      <ContactForm
        showSuccessPopup={showSuccessPopup}
        showFailurePopup={showFailurePopup}
      />
      <div
        classList={{
          [styles.messageStatusContainer]: true,
          hidden: !showSuccessMessage(),
        }}
      >
        <img src={Success} alt="success" />
        <p class={styles.successText}>The message was sent successfully.</p>
      </div>
      <div
        classList={{
          [styles.messageStatusContainer]: true,
          hidden: !showFailureMessage(),
        }}
      >
        <img src={Error} alt="error" />
        <p class={styles.failureText}>The message failed to send.</p>
      </div>
      <div class={styles.topStarContainer}>
        <div class={`${styles.star} ${styles.greenStar}`}></div>
        <div class={`${styles.star} ${styles.blueStar}`}></div>
        <div class={`${styles.star} ${styles.orangeStar}`}></div>
      </div>
      <div class={styles.bottomStarContainer}>
        <div class={`${styles.star} ${styles.purpleStar}`}></div>
        <div class={`${styles.star} ${styles.yellowStar}`}></div>
      </div>
      <div class={styles.treesContainer}>
        <img src={Trees} alt="" />
      </div>
    </section>
  );
}

type ContactFormProps = {
  showSuccessPopup: () => void;
  showFailurePopup: () => void;
};

function ContactForm(props: ContactFormProps) {
  const initialData = {
    name: "",
    email: "",
    message: "",
  };
  const [data, setData] = createSignal(initialData);

  const initialFormError = {
    name: false,
    email: false,
    message: false,
  };
  const [showFormError, setShowFormError] = createSignal(initialFormError);

  const errors = createMemo(() => {
    let name, email, message;
    if (!data().name) {
      name = "Please enter your name";
    } else if (data().name.length < 3) {
      name = "Name is too short";
    } else {
      name = "";
    }

    const emailRegex =
      /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    if (!data().email) {
      email = "Please enter your email";
    } else if (!emailRegex.test(data().email)) {
      email = "Please enter a valid email";
    } else {
      email = "";
    }

    if (!data().message) {
      message = "Please enter a message";
    } else if (data().message.length < 10) {
      message = "Message is too short";
    } else {
      message = "";
    }

    return { name, email, message };
  });

  const handleChange = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [target.name]: target.value }));
    setShowFormError((prev) => ({ ...prev, [target.name]: false }));
  };

  const sendEmail = async (e: SubmitEvent) => {
    e.preventDefault();

    const url = "/.netlify/functions/sendEmail";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data()),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        return Promise.reject(response);
      })
      .then(() => {
        props.showSuccessPopup();
        setData(initialData);
        setShowFormError(initialFormError);
      })
      .catch((response) => {
        props.showFailurePopup();
        console.log(response);
      });
  };

  return (
    <form class={styles.contactCard} onSubmit={sendEmail}>
      <div class={styles.contactInputGroup}>
        <label for="name">Name</label>
        <input
          type="text"
          value={data().name}
          onInput={handleChange}
          onBlur={() => setShowFormError((prev) => ({ ...prev, name: true }))}
          name="name"
          id="name"
        />
        <div
          classList={{
            [styles.errorMessageContainer]: true,
            [styles.opacityZero]: !showFormError().name || !errors().name,
          }}
          id="name-error"
        >
          <p class={styles.errorMessage}>{errors().name}</p>
        </div>
      </div>
      <div class={styles.contactInputGroup}>
        <label for="email">Email</label>
        <input
          type="email"
          value={data().email}
          onInput={handleChange}
          onBlur={() => setShowFormError((prev) => ({ ...prev, email: true }))}
          name="email"
          id="email"
        />
        <div
          classList={{
            [styles.errorMessageContainer]: true,
            [styles.opacityZero]: !showFormError().email || !errors().email,
          }}
          id="email-error"
        >
          <p class={styles.errorMessage}>{errors().email}</p>
        </div>
      </div>
      <div class={styles.contactInputGroup}>
        <label for="message">Message</label>
        <textarea
          class={styles.textarea}
          value={data().message}
          onInput={handleChange}
          onBlur={() =>
            setShowFormError((prev) => ({ ...prev, message: true }))
          }
          id="message"
          name="message"
        ></textarea>
        <div
          classList={{
            [styles.errorMessageContainer]: true,
            [styles.opacityZero]: !showFormError().message || !errors().message,
          }}
          id="message-error"
        >
          <p class={styles.errorMessage}>{errors().message}</p>
        </div>
      </div>
      <button
        type="submit"
        class={styles.sendButton}
        disabled={!!errors().name || !!errors().email || !!errors().message}
      >
        Submit Form
      </button>
    </form>
  );
}
