<template>
  <div class="about-page">
    <div class="container">
      <figure class="avatar">
        <img src="/profile-photo.jpg">
      </figure>
      <p>My name is Kathiravan Kumarasamy and I am Sr.UI Developer and freelance developer.</p>
      <br>
      <p> I have a Master's degree in Electronics and Communications Engineering and several years of experience working on a wide range of technologies and projects for web applications in HTML, CSS, HTML5, CSS3, Javascript, jQuery, Vue.js, Vuetify.js, Bootstrap, Bootstrap-Vue, Firebase, Firestore, MongodB.</p>
      <br>
      <p>Throughout my career, I have acquired advanced technical knowledge in Web Technologies.</p>
    </div>
  </div>
</template>
<script>
  export default {
    head:{
      title: `Know more about Kathiravan K | Sr.UI Developer`
    }
  }
</script>

<style scoped lang="scss">
  .about-page {
    padding-top: 80px;
    position: relative;
    max-width: 800px;
    margin: 0 auto 5rem auto;
    font-size: 25px;
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
    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
</style>