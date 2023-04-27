import { createSignal, For, onMount, Show } from "solid-js";
import type { Project } from "../../lib/types";
import Play from "../../assets/play-button.svg";
import Pause from "../../assets/pause-button.svg";
import GitHub from "../../assets/github.svg";
import Link from "../../assets/link.svg";
import styles from "./index.module.css";

export function Projects(props: { projects: Project[] }) {
  return (
    <div class={styles.projectsContainer}>
      <For each={props.projects}>
        {(project) => <ProjectCard {...project} />}
      </For>
    </div>
  );
}

function ProjectCard(props: Project) {
  const [currentVideoIndex, setCurrentVideoIndex] = createSignal(-1);
  const [isVideoPlaying, setIsVideoPlaying] = createSignal(false);
  const [showPauseButton, setShowPauseButton] = createSignal(false);

  let currentVideo: HTMLVideoElement | null = null;

  onMount(() => {
    if (props.order === 1) {
      playVideo(props.videos[0].name);
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
    const videoIndex = props.videos.findIndex((video) => video.name === name);
    if (videoIndex === -1) return;
    setCurrentVideoIndex(videoIndex);
    currentVideo.src = props.videos[currentVideoIndex()].url;
    currentVideo
      ?.play()
      .then(() => {
        currentVideo!.currentTime = 0;
        setIsVideoPlaying(true);
      })
      .catch((err) => {
        console.log({ err });
      });
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
            <img
              role="button"
              aria-label="play"
              tabindex="0"
              class={styles.videoButton}
              src={Play}
              alt="play button"
              onClick={() => {
                if (currentVideo) {
                  currentVideo?.play();
                } else {
                  playVideo(props.videos[0].name);
                }
                setIsVideoPlaying(true);
                setShowPauseButton(true);
              }}
            />
          </Show>
          <Show when={showPauseButton()}>
            <img
              role="button"
              aria-label="pause"
              tabindex="0"
              class={styles.videoButton}
              src={Pause}
              alt="pause button"
              onClick={() => {
                currentVideo?.pause();
              }}
            />
          </Show>
          <div class={styles.promptContainer}>
            <p>Click a feature to play</p>
          </div>
        </div>
        <div class={styles.buttonGroup}>
          {props.videos.map(({ name }, index) => (
            <button
              classList={{
                [styles.featureButton]: true,
                [styles.active]: currentVideoIndex() === index,
              }}
              onClick={() => playVideo(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div class={styles.infoHalf}>
        <h3 class={styles.projectName}>{props.name}</h3>
        <div class={styles.infoContainer}>
          <div class={styles.projectInfo}>
            <div class={styles.projectDescription}>
              <p>{props.description}</p>
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
            <p>Link</p>
          </a>
        </div>
      </div>
    </article>
  );
}
