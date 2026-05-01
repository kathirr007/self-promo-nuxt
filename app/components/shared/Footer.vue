<template>
  <div class="hero-footer footer footer-custom has-background-dark">
    <div class="container">
      <div class="has-text-centered">
        <a class="icon has-text-white" target="_blank" rel="noopener noreferrer" aria-label="Follow me on Github" href="https://github.com/kathirr007">
          <i class="fab fa-github" />
        </a>
        <a class="icon has-text-white ml-2" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kathirr007/" aria-label="Connect with me on LinkedIn">
          <i class="fab fa-linkedin" />
        </a>
        <a class="icon has-text-white ml-2" target="_blank" rel="noopener noreferrer" aria-label="Tweet me on Twitter" href="https://twitter.com/kathirr_007">
          <i class="fab fa-twitter-square" />
        </a>
        <a class="icon has-text-white ml-2" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/kathirr007" aria-label="Like and share my Posts on Facebook">
          <i class="fab fa-facebook-square" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon {
  width: auto;
  height: auto;
}

[class*='fa-'] {
  font-size: 22px;
}

.footer {
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}

.footer-custom {
  color: #fff;
}

.footer-custom p {
  font-size: 1rem;
  font-weight: 500;
}

.footer-custom a {
  color: #d74436;
}

.footer-custom a:hover {
  color: #e50076;
}
</style>
