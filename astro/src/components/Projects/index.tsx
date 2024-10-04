import { createSignal, For, onMount, Show } from "solid-js";
import Play from "../../assets/play-button.svg";
import Pause from "../../assets/pause-button.svg";
import styles from "./index.module.css";

export function Projects(props: { projects: TranslatedProject[] }) {
  const [language, setLanguage] = createSignal<"en" | "fr">("en");
  onMount(() => {
    const language = localStorage.getItem("language");
    if (language) {
      setLanguage(language as "en" | "fr");
      return;
    }
    const browserLanguage = window.navigator.language.split("-")[0];
    if (browserLanguage === "fr") {
      setLanguage("fr");
    } else [setLanguage("en")];
  });

  return (
    <div class={styles.projectsContainer}>
      <For each={props.projects}>
        {(project) => <ProjectCard {...project} language={language()} />}
      </For>
    </div>
  );
}

function ProjectCard(props: TranslatedProject & { language: "en" | "fr" }) {
  const [currentVideoIndex, setCurrentVideoIndex] = createSignal(-1);
  const [isVideoPlaying, setIsVideoPlaying] = createSignal(false);
  const [showPauseButton, setShowPauseButton] = createSignal(false);

  let currentVideo: HTMLVideoElement | null = null;
  let playButton: HTMLButtonElement | undefined = undefined;
  let pauseButton: HTMLButtonElement | undefined = undefined;

  onMount(() => {
    if (props.order === 1 && !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      playVideo(props.videos[0].name.en);
    }
  });

  const playVideo = (name: string) => {
    if (!currentVideo) {
      currentVideo = document.querySelector(
        `.${styles[toCamalCase(props.name)]} video`
      ) as HTMLVideoElement;
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        currentVideo.autoplay = true;
      }
    }
    const videoIndex = props.videos.findIndex(
      (video) => video.name.en === name
    );
    if (videoIndex === -1) return;
    const newVideo = document.createElement("video");
    newVideo.src = props.videos[videoIndex].url;
    newVideo.muted = true;
    newVideo.autoplay = true;
    newVideo.onloadeddata = async () => {
      currentVideo!.src = newVideo.src;
      currentVideo!.currentTime = 0;
      await currentVideo!.play();
      setIsVideoPlaying(true);
      setCurrentVideoIndex(videoIndex);
      newVideo.remove();
    };
  };

  const toCamalCase = (str: string) => {
    return str
      .split("-")
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  };

  return (
    <article class={`${styles.projectCard} ${styles[toCamalCase(props.name)]}`}>
      <div class={styles.imageHalf}>
        <div
          class={styles.individualProjectImageContainer}
          onMouseEnter={() => {
            if (isVideoPlaying()) {
              setShowPauseButton(true);
            }
          }}
          onMouseLeave={() => {
            if (isVideoPlaying()) {
              setShowPauseButton(false);
            }
          }}
        >
          <div class={`${styles.videoLoader} hidden`}></div>
          <Show when={currentVideoIndex() === -1}>
            <img
              src={props.imageUrl}
              class={styles.projectImage}
              alt={props.name}
            />
          </Show>
          <video
            class={currentVideoIndex() >= 0 ? styles.projectVideo : "hidden"}
            muted={true}
            onPause={() => {
              setIsVideoPlaying(false);
              setShowPauseButton(false);
            }}
            onEnded={() => {
              setCurrentVideoIndex(-1);
              setIsVideoPlaying(false);
              setShowPauseButton(false);
              currentVideo = null;
            }}
          ></video>
          <Show when={!isVideoPlaying()}>
            <button
              class={styles.videoButton}
              ref={playButton}
              onClick={() => {
                if (currentVideo) {
                  currentVideo?.play();
                } else {
                  playVideo(props.videos[0].name.en);
                }
                setIsVideoPlaying(true);
                setShowPauseButton(true);
                pauseButton?.focus();
              }}
            >
              <img src={Play} alt="play button" />
            </button>
          </Show>
          <Show when={showPauseButton()}>
            <button
              class={styles.videoButton}
              ref={pauseButton}
              onClick={() => {
                currentVideo?.pause();
                setTimeout(() => {
                  playButton?.focus();
                }, 0);
              }}
            >
              <img src={Pause} alt="pause button" />
            </button>
          </Show>
          {/* <div class={styles.promptContainer}>
            <p class="hint-text">Click a feature to play</p>
          </div> */}
        </div>
        <div class={styles.buttonGroup}>
          {props.videos.map(({ name }, index) => (
            <button
              classList={{
                [styles.featureButton]: true,
                [styles.active]: currentVideoIndex() === index,
              }}
              onClick={() => playVideo(name.en)}
            >
              {name[props.language]}
            </button>
          ))}
        </div>
      </div>
      <div class={styles.infoHalf}>
        <h3 class={`${styles.projectName} ${styles[toCamalCase(props.name)]}`} >{props.name}</h3>
        <div class={styles.infoContainer}>
          <div class={styles.projectInfo}>
            <div class={styles.projectDescription}>
              <p>{props.description[props.language]}</p>
            </div>
            <ul class={styles.projectSkills}>
              {props.technologies.map((technology) => (
                <li>{technology}</li>
              ))}
            </ul>
          </div>
        </div>
        <div class={styles.linkContainer}>
          <a target="_blank" href={`https://github.com/Taosit/${props.github}`}>
            <span class={styles.projectIconContainer}>
              <svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"/></svg>
            </span>
            <p>GitHub</p>
          </a>
          <a target="_blank" href={props.url}>
            <span class={styles.projectIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                <g id="surface115163943">
                  <path style=" stroke:none;fill-rule:nonzero;fill:#fff;fill-opacity:1;" d="M 24 5.5625 C 24 4.136719 23.457031 2.707031 22.375 1.625 C 20.210938 -0.539062 16.664062 -0.539062 14.5 1.625 L 10.84375 5.28125 C 10.445312 5.667969 10.441406 6.304688 10.828125 6.703125 C 11.214844 7.101562 11.851562 7.105469 12.25 6.71875 L 15.9375 3.03125 C 17.335938 1.632812 19.570312 1.632812 20.96875 3.03125 C 22.367188 4.429688 22.367188 6.664062 20.96875 8.0625 L 16.0625 12.96875 C 14.664062 14.367188 12.429688 14.367188 11.03125 12.96875 C 10.867188 12.804688 10.75 12.621094 10.625 12.4375 C 10.3125 11.980469 9.691406 11.859375 9.234375 12.171875 C 8.777344 12.484375 8.65625 13.105469 8.96875 13.5625 C 9.164062 13.847656 9.375 14.125 9.625 14.375 C 11.789062 16.539062 15.335938 16.539062 17.5 14.375 L 22.375 9.5 C 23.457031 8.417969 24 6.988281 24 5.5625 Z M 15.125 10.78125 C 15.117188 10.738281 15.105469 10.695312 15.09375 10.65625 C 15.0625 10.507812 15 10.371094 14.90625 10.25 C 14.746094 10.039062 14.570312 9.820312 14.375 9.625 C 12.210938 7.460938 8.664062 7.460938 6.5 9.625 L 1.625 14.5 C -0.539062 16.664062 -0.539062 20.210938 1.625 22.375 C 3.789062 24.539062 7.335938 24.539062 9.5 22.375 L 13.125 18.71875 C 13.421875 18.476562 13.558594 18.089844 13.472656 17.714844 C 13.386719 17.34375 13.09375 17.050781 12.722656 16.964844 C 12.347656 16.878906 11.960938 17.015625 11.71875 17.3125 L 8.0625 20.96875 C 6.664062 22.367188 4.429688 22.367188 3.03125 20.96875 C 1.632812 19.570312 1.632812 17.335938 3.03125 15.9375 L 7.9375 11.03125 C 9.335938 9.632812 11.570312 9.632812 12.96875 11.03125 C 13.09375 11.152344 13.179688 11.300781 13.28125 11.4375 C 13.527344 11.839844 14.023438 12.015625 14.46875 11.855469 C 14.914062 11.699219 15.1875 11.25 15.125 10.78125 Z M 15.125 10.78125 "/>
                </g>
              </svg>
            </span>
            <p class="link-to-projects">Link</p>
          </a>
        </div>
      </div>
    </article>
  );
}
