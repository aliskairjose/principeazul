<template>
  <b-container fluid>
    <b-row>
      <b-col md="3" sm="6">
        <iq-card>
          <template v-slot:body>
            <div class="d-flex align-items-center justify-content-between">
                <h6>{{ $t('dashboard1.card1') }}</h6>
                <span class="iq-icon"><i class="ri-information-fill"></i></span>
              </div>
              <div class="iq-customer-box d-flex align-items-center justify-content-between mt-3">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle iq-card-icon iq-bg-primary mr-2"> <i class="ri-inbox-fill"></i></div>
                    <h2>352</h2>
                </div>
                <div class="iq-map text-primary font-size-32"><i class="ri-bar-chart-grouped-line"></i></div>
              </div>
          </template>
        </iq-card>
      </b-col>
      <b-col md="3" sm="6">
        <iq-card>
          <template v-slot:body>
            <div class="d-flex align-items-center justify-content-between">
              <h6>{{ $t('dashboard1.card2') }}</h6>
              <span class="iq-icon"><i class="ri-information-fill"></i></span>
            </div>
            <div class="iq-customer-box d-flex align-items-center justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="rounded-circle iq-card-icon iq-bg-danger mr-2"><i class="ri-radar-line"></i></div>
                <h2>$37k</h2>
              </div>
              <div class="iq-map text-danger font-size-32"><i class="ri-bar-chart-grouped-line"></i></div>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col md="3" sm="6">
        <iq-card>
          <template v-slot:body>
            <div class="d-flex align-items-center justify-content-between">
              <h6>{{ $t('dashboard1.card3') }}</h6>
              <span class="iq-icon"><i class="ri-information-fill"></i></span>
            </div>
            <div class="iq-customer-box d-flex align-items-center justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="rounded-circle iq-card-icon iq-bg-warning mr-2"><i class="ri-price-tag-3-line"></i></div>
                <h2>32%</h2>
              </div>
              <div class="iq-map text-warning font-size-32"><i class="ri-bar-chart-grouped-line"></i></div>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col md="3" sm="6">
        <iq-card>
          <template v-slot:body>
            <div class="d-flex align-items-center justify-content-between">
              <h6>{{ $t('dashboard1.card4') }}</h6>
              <span class="iq-icon"><i class="ri-information-fill"></i></span>
            </div>
            <div class="iq-customer-box d-flex align-items-center justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="rounded-circle iq-card-icon iq-bg-info mr-2"><i class="ri-refund-line"></i></div>
                <h2>27h</h2>
              </div>
              <div class="iq-map text-info font-size-32"><i class="ri-bar-chart-grouped-line"></i></div>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Pedidos para hoy</h4>
          </template>
          <template v-slot:headerAction>
            <b-dropdown  id="dropdownMenuButton5" right variant="none" data-toggle="dropdown">
              <template v-slot:button-content>
                <span class="text-primary"><i class="ri-more-fill"></i></span>
              </template>
              <b-dropdown-item><i class="ri-eye-fill mr-2"></i>{{ $t('dropdown.view') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>{{ $t('dropdown.delete') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>{{ $t('dropdown.edit') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-printer-fill mr-2"></i>{{ $t('dropdown.print') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>{{ $t('dropdown.download') }}</b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:body>
            <b-table responsive :items="items"  class="mb-0 table-borderless">
              <template v-slot:cell(estado)="data">
                <b-badge pill :variant="data.value.color">{{ data.value.name }}</b-badge>
              </template>
              <template v-slot:cell(monto)="data1">
                ${{ data1.value }}
              </template>
            </b-table>
          </template>
        </iq-card>
      </b-col>
      <b-col md="4">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Pedidos completados</h4>
          </template>
          <template v-slot:headerAction>
            <b-dropdown  id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
              <template v-slot:button-content>
                <span class="text-primary"><i class="ri-more-fill"></i></span>
              </template>
              <b-dropdown-item><i class="ri-eye-fill mr-2"></i>{{ $t('dropdown.view') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>{{ $t('dropdown.delete') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>{{ $t('dropdown.edit') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-printer-fill mr-2"></i>{{ $t('dropdown.print') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>{{ $t('dropdown.download') }}</b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:body>
            <ul class="suggestions-lists m-0 p-0">
              <li v-for="(compra,index) in monthlyInvocie" :key="index" class="d-flex mb-4 align-items-center">
                <div :class="'profile-icon iq-bg-' + compra.color" ><span><i class="ri-check-fill"></i></span></div>
                <div class="media-support-info ml-3">
                  <h6>{{ compra.title }}</h6>
                  <!-- <p class="mb-0"><span :class="'text-' + compra.color">{{ compra.paid_month }} paid</span> month out of {{ compra.total_month }}</p> -->
                </div>
                <div class="media-support-monto ml-3">
                  <h6><span :class="'text-' + compra.color">$</span><b> {{ compra.monto }}</b></h6>
                  <!-- <p class="mb-0">per month</p> -->
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8">
       <iq-card class-name="overflow-hidden">
          <template v-slot:headerTitle>
            <h4 class="card-title">Ganancias totales</h4>
          </template>
          <template v-slot:headerAction>
            <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
              <template v-slot:button-content>
                 <i class="ri-more-fill"></i>
              </template>
              <b-dropdown-item><i class="ri-eye-fill mr-2"></i>{{ $t('dropdown.view') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>{{ $t('dropdown.delete') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>{{ $t('dropdown.edit') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-printer-fill mr-2"></i>{{ $t('dropdown.print') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>{{ $t('dropdown.download') }}</b-dropdown-item>
            </b-dropdown>
          </template>
            <ApexChart element="home-chart-02" :chartOption="darkChart1" v-if="$route.meta.dark" style="min-height: 350px;"/>
            <ApexChart element="home-chart-02" :chartOption="chart1" v-else style="min-height: 350px;"/>
        </iq-card>
      </b-col>
      <b-col md="4">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Pedidos completados</h4>
          </template>
          <template v-slot:headerAction>
            <b-dropdown  id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
              <template v-slot:button-content>
                <span class="text-primary"><i class="ri-more-fill"></i></span>
              </template>
              <b-dropdown-item><i class="ri-eye-fill mr-2"></i>{{ $t('dropdown.view') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>{{ $t('dropdown.delete') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>{{ $t('dropdown.edit') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-printer-fill mr-2"></i>{{ $t('dropdown.print') }}</b-dropdown-item>
              <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>{{ $t('dropdown.download') }}</b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:body>
            <ul class="suggestions-lists m-0 p-0">
              <li v-for="(compra,index) in monthlyInvocie" :key="index" class="d-flex mb-4 align-items-center">
                <div :class="'profile-icon iq-bg-' + compra.color" ><span><i class="ri-check-fill"></i></span></div>
                <div class="media-support-info ml-3">
                  <h6>{{ compra.title }}</h6>
                  <!-- <p class="mb-0"><span :class="'text-' + compra.color">{{ compra.paid_month }} paid</span> month out of {{ compra.total_month }}</p> -->
                </div>
                <div class="media-support-monto ml-3">
                  <h6><span :class="'text-' + compra.color">$</span><b> {{ compra.monto }}</b></h6>
                  <!-- <p class="mb-0">per month</p> -->
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
// import AmChart from '../../components/vito/charts/AmChart'
export default {
  name: 'Dashboard1',
  // components: { AmChart },
  mounted () {
    vito.index()
  },
  data () {
    return {
      items: [
        { cliente: 'Ira Membrit', fecha: '18/10/2019', compra: '20156', monto: '1500', estado: { name: 'paid', color: 'success' } },
        { cliente: 'Pete Sariya', fecha: '26/10/2019', compra: '7859', monto: '2000', estado: { name: 'paid', color: 'success' } },
        { cliente: 'Cliff Hanger', fecha: '18/11/2019', compra: '6396', monto: '2500', estado: { name: 'past due', color: 'danger' } },
        { cliente: 'Terry Aki', fecha: '14/12/2019', compra: '7854', monto: '5000', estado: { name: 'paid', color: 'success' } },
        { cliente: 'Anna Mull', fecha: '24/12/2019', compra: '568569', monto: '10000', estado: { name: 'paid', color: 'success' } }
      ],
      monthlyInvocie: [
        { title: 'Alfredo Rodriguez', color: 'success', monto: '12,434.00', paid_month: '17', total_month: '23' },
        { title: 'Pedro Muñoz', color: 'warning', monto: '12,434.00', paid_month: '17', total_month: '23' },
        { title: 'Alfredo Rodriguez', color: 'success', monto: '12,434.00', paid_month: '17', total_month: '23' },
        { title: 'Alfredo Rodriguez', color: 'danger', monto: '12,434.00', paid_month: '17', total_month: '23' }
      ],
      paymentHistory: [
        { title: 'Deposit from ATL', monto: '- 1,470', icon: 'ri-refresh-line', color: 'secondary', fecha: '5 march, 18:33', currency: 'USD' },
        { title: 'Deposit PayPal', monto: '+ 2,220', icon: 'ri-paypal-line', color: 'primary', fecha: '5 march, 18:33', currency: 'USD' },
        { title: 'Deposit from ATL', monto: '+ 250', icon: 'ri-check-line', color: 'primary', fecha: '5 march, 18:33', currency: 'USD' },
        { title: 'Cancelled', monto: '0', icon: 'ri-close-line', color: 'info', fecha: '5 march, 18:33', currency: 'USD' },
        { title: 'Refund', monto: '- 500', icon: 'ri-arrow-go-back-fill', color: 'info', fecha: '5 march, 18:33', currency: 'USD' },
        { title: 'Deposit from ATL', monto: '- 1,470', icon: 'ri-refresh-line', color: 'secondary', fecha: '5 march, 18:33', currency: 'USD' }
      ],
      chart1: {
        series: [{
          name: 'Ganancias totales',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        chart: {
          type: 'bar',
          height: 350
        },
        colors: ['#6ce6f4'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        },
        yaxis: {
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$ ' + val + ' thousands'
            }
          }
        }
      },
      chart2: {
        series: [{
          name: 'Desktops',
          data: [5, 10, 8, 15]
        }],
        chart: {
          height: 150,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        colors: ['#827af3'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr']
        }
      },
      darkChart2: {
        series: [{
          name: 'Desktops',
          data: [5, 10, 8, 15]
        }],
        chart: {
          height: 150,
          type: 'line',
          foreColor: '#8c91b6',
          zoom: {
            enabled: false
          }
        },
        colors: ['#827af3'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr']
        }
      },
      chart3: {
        series: [44, 55, 13, 33],
        chart: {
          width: 380,
          height: 180,
          type: 'donut'
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#827af3', '#6ce6f4', '#a09e9e', '#fbc647'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false
            }
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 150
        }
      },
      darkChart3: {
        series: [44, 55, 13, 33],
        chart: {
          width: 380,
          height: 180,
          foreColor: '#8c91b6',
          type: 'donut'
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#827af3', '#6ce6f4', '#a09e9e', '#fbc647'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false
            }
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 150
        }
      }
    }
  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
#spinner {
    z-index: 1000;
    position: absolute;
    left: 0;
  }
</style>
