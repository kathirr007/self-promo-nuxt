<template>
  <p>Redirecting...</p>
</template>

<script>
export default {

/*   mounted() {
    const code = this.$route.query.code;
    if (code !== '') {
      const params = new URLSearchParams();
      params.append('client_id', '952132017083-to68rg93dp9ao68ulhim23853vhc3hvq.apps.googleusercontent.com');
      params.append('client_secret', '8TrQ_aL67xS3tr_0Jm3fXP6f');
      params.append('code', code);
      params.append('redirect_uri', 'http://localhost:3600/callback');
      debugger
      this.$axios
        .$post('https://slack.com/api/oauth.access', params, {
          withCredentials: false,
          transformRequest: [
            (data, headers) => {
              headers.post['Content-Type'] =
                'application/x-www-form-urlencoded';
              return data;
            }
          ]
        })
        .then(response => {
          this.$store.state.token = response.access_token;
          this.$store.state.user = response.user_id;
          this.$store.state.team = response.team_id;
          this.$router.push({ path: '/' });
        });
    }
  } */
};
</script>