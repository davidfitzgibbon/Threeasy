<script>
  export let prev = false;
  export let next = false;
</script>

<div class="waypoints">

  {#if prev}
    <a href="{prev.url}" class="waypoint prev">
      <svg viewBox="0 20 100 60">
       <path d="M10 59V41h46L40 25h25l25 25-25 25H40l16-16H10Z"/>
     </svg>
       {prev.title}
    </a>
  {/if}
  {#if next}
    <a href="{next.url}" class="waypoint next">
      {next.title}
      <svg viewBox="0 20 100 60">
       <path d="M10 59V41h46L40 25h25l25 25-25 25H40l16-16H10Z"/>
     </svg>
    </a>
  {/if}

</div>

<style>
  .waypoints {
    grid-column-start: 2;
    grid-column-end: 4;
    display: grid;
    grid-template-columns: repeat(2, min-content);
    gap: 3rem;
    justify-content: space-between;
  }
  a {
    font-weight: 600;
    text-decoration: none;
    display: flex;
    gap: .5em;
    align-items: center;
  }
  a.next {
    justify-content: flex-end;
  }
  a.prev {
    justify-content: flex-start;
  }
  a:hover {
    text-decoration: underline;
  }

  svg {
    display: inline;
    height: 1em;
    fill: currentColor;
    display: block;
  }
  a.prev svg {
    transform: rotate(180deg);
  }
  path {
    fill: var(--gray-5)
  }
  a:hover path {
    animation: slide 1s infinite;
    animation-play-state: paused;
    animation-timing-function: linear;
    animation-play-state: running;
  }
  @keyframes slide {
    0% {
      transform: translate(0%, 0);
    }
    49.999% {
      transform: translate(100%, 0);
    }
    50% {
      transform: translate(-100%, 0);
    }
    100% {
      transform: translate(0%, 0%);
    }
  }
</style>