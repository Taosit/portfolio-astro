import { createSignal, For, onMount, Show } from "solid-js";
import Play from "../../assets/play-button.svg";
import Pause from "../../assets/pause-button.svg";
import GitHub from "../../assets/github.svg";
import Link from "../../assets/link.svg";
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
          <div class={styles.promptContainer}>
            <p class="hint-text">Click a feature to play</p>
          </div>
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
        <h3 class={styles.projectName}>{props.name}</h3>
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
              <img src={GitHub} alt="github" />
            </span>
            <p>GitHub</p>
          </a>
          <a target="_blank" href={props.url}>
            <span class={styles.projectIconContainer}>
              <img src={Link} alt="link to project" />
            </span>
            <p class="link-to-projects">Link</p>
          </a>
        </div>
      </div>
    </article>
  );
}
