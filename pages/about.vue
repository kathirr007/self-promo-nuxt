<template>
  <div class="about-page">
    <div class="container">
      <figure class="avatar">
        <img src="/profile-photo.jpg" />
      </figure>
      <p>
        My name is Kathiravan Kumarasamy and I am
        <strong>Sr.UI Developer</strong> and
        <strong>Freelance Developer</strong>.
      </p>
      <br />
      <p>
        I have a Master's degree in Electronics and Communications Engineering and several years of experience working on a wide range of technologies and projects for web applications in
        <strong>HTML</strong>,
        <strong>CSS</strong>,
        <strong>HTML5</strong>,
        <strong>CSS3</strong>,
        <strong>Javascript</strong>,
        <strong>jQuery</strong>,
        <strong>Gulp.js</strong>,
        <strong>Node.js</strong>,
        <strong>Vue.js</strong>,
        <strong>Nuxt.js</strong>,
        <strong>Vuetify.js</strong>,
        <strong>Bulma</strong>,
        <strong>Tailwind</strong>,
        <strong>Bootstrap</strong>,
        <strong>Bootstrap-Vue</strong>,
        <strong>Firebase</strong>,
        <strong>Firestore</strong>,
        <strong>MongodB</strong> and
        <strong>Git/Github</strong>.
      </p>
      <br />
      <p>Throughout my career, I have acquired advanced technical knowledge in Web Technologies.</p>
    </div>
  </div>
</template>
<script>
export default {
  head: {
    title: `Know more about Kathiravan K | Sr.UI Developer`,
  },
};
</script>

<style scoped lang="scss">
.about-page {
  padding: 1rem;
  position: relative;
  // max-width: 800px;
  // margin: 0 auto 5rem auto;
  font-size: 18px;
  @media screen and (min-width: 576px) {
    font-size: 26px;
  }
}
.avatar {
  margin-right: 20px;
  float: left;
}
.avatar img {
  height: 128px;
  width: 128px;
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
</style>