<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <div class="d-flex align-items-center justify-content-between">
              <iframe
                :src="iframeUrl"
                frameborder="0"
                width="100%"
                height="650"
                allowtransparency
              >
              </iframe>
              <!-- <iframe
                src="iframeUrl"
                frameborder="0"
                width="800"
                height="600"
                allowtransparency
              >
              </iframe> -->
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'Dashboard1',
  mounted () {
    vito.index()
    if (localStorage.getItem('role') === 'ventas') {
      this.$router.push({ name: 'dashboard.home-taller' })
      return
    }

    let jwt = require('jsonwebtoken')

    const METABASE_SITE_URL = 'https://intelligence.cronapis.com'
    const METABASE_SECRET_KEY = '0156c408fdcb44a1d69051733b6b982a9a6bd4dbd0678c5c274fa654f1ea1fb7'
    const payload = {
      resource: { dashboard: 10 },
      params: { },
      exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    }
    const token = jwt.sign(payload, METABASE_SECRET_KEY)
    this.iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`
  },
  data () {
    return {
      iframeUrl: ''
    }
  }
}
</script>

<style>
</style>
