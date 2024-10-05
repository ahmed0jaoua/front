
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { circle, latLng, tileLayer } from 'leaflet';
import { BestSelling, Recentelling, TopSelling, statData } from 'src/app/core/data';
import { ChartType } from './dashboard.model';
import { StatistiqueService } from 'src/app/core/services/statistique.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { BonlivraisonService } from 'src/app/core/services/bonlivraison.service';
import { cloneDeep } from 'lodash';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { fetchInvoiceListData } from 'src/app/store/Invoice/invoice_action';
import { selectInvoiceLoading } from 'src/app/store/Invoice/invoice_selector';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {

  content?: any;
  econtent?: any;
  invoices?: any;
  allinvoices: any;
  searchResults: any;
  searchTerm: any;
  date: any;
  status: any = '';
  commandes: any[] = [];
  bons: any[] = [];
  allCommandes: any[] = [];
  originalbons: any[] = [];
  pageBon: any[] = [];
  


  breadCrumbItems!: Array<{}>;
  analyticsChart!: ChartType;
  salesForecastChart!: ChartType;
  analyticsChartN!: ChartType;
  BestSelling: any;
  TopSelling: any;
  Recentelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  year: any;

  currentDate: any;
 statusData :any ; 
 constructor(public toastService: ToastService,
  private StatistiqueService: StatistiqueService,
  public service: PaginationService,
  private BonlivraisonService: BonlivraisonService,
  private store: Store<{ data: RootReducerState }>,

) {
  var date = new Date();
  this.currentDate = date;
  this.year = new Date().getFullYear();

  }

  listeLivraisonParYear: any[] = [];
  seriesData: any = {};
  LivraisonsBySite: any;
  LivraisonsByEtat :any ;
  statusName :any ;  
  statutDelivery :any ;
  static :any ; 
  TotalFraisByMonth : any ; 
  TotalCRByMonth : any ; 
  currentUser: any;

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    const currentUserString = localStorage.getItem('currentUser');
    this.currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.store.dispatch(fetchInvoiceListData());
    this.store.select(selectInvoiceLoading).subscribe((data) => {
      if (data == false) {
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Dashboard', active: true }
    ];

    if (localStorage.getItem('toast')) {
      this.toastService.show('Logged in Successfull.', { classname: 'bg-success text-center text-white', delay: 5000 });
      localStorage.removeItem('toast');
    }

    /**
    * Fetches the data
    */

    this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
      this.bons = data.ListLivraison ;
      this.allinvoices = cloneDeep(data.ListLivraison);
      this.bons = this.service.changePage(this.allinvoices)
    });

   
   
    this.fetchData();
  
    console.log('loaded')
    this.StatistiqueService.getStatistiques().subscribe((data: any) => {
      this.static = data;
      this.statusData = [
        {
          title: 'clients',
          value: this.static?.countClientsEtat0?.count,
          icon: 'bx-user-pin',
          persantage: '0.00',
          profit: 'up',
          icon_bg_color: 'bg-warning',
          link: 'Liste des clients',
          route :   '/clients/listeClients'
        },
        {
        title: 'Livraisons Termine',
        value:  this.static?.countLivraisonStatut2?.count,
        icon: 'bx-receipt',
        //persantage: '00',
        profit: 'up',
        link: 'Liste des livraisons',
        icon_bg_color: 'bg-success',
         route :   '/bon/list',
      }, {
        title: 'vehicule  disponible ',
        value: this.static?.countVehicules ,
        icon: 'bxs-truck',
        persantage: '0.00',
        profit: 'up',
        link: 'Liste des véhicules',
          route :   '/vehicules/list',
        icon_bg_color: 'bg-info'
      },  {
        title: 'chauffeur disponible     ',
        value:  this.static?.countChauffeurs,
        icon: 'bx-walk',
        persantage: '0.00',
        profit: 'equal',
        icon_bg_color: 'bg-danger',
        link: 'Liste des chauffeurs',label :'ffff ',
        route :   '/vehicules/list',
      }
      ];

    });
    this.seriesData = Array(12).fill(0);
    this.TotalFraisByMonth = Array(12).fill(0);
    this.TotalCRByMonth = Array(12).fill(0);
    this.StatistiqueService.getLivraisonParYear(Number(this.year)).subscribe((data: any) => {

    //  this.LivraisonsBySite = data.LivraisonsBySite;
   //   this.siteNames = this.LivraisonsBySite.map((site: any) => site?.site_name);
    //  this.siteDeliveries = this.LivraisonsBySite.map((site: any) => site?.nombre_livraison);
      this.LivraisonsBySite  =data.LivraisonsBySite.map((livraison: any) => ({
        name: livraison.name,
        data: [livraison.data],
      }));


      this.LivraisonsByEtat = data.LivraisonsByEtat;
      this.statusName = this.LivraisonsByEtat.map((site: any) => site?.statut_name);
      this.statutDelivery = this.LivraisonsByEtat.map((site: any) => site?.nombre_livraison);

      this.listeYear = data.LivraisonYears;
      this.listeLivraisonParYear = data;
      data.LivraisonsByMonth.forEach((item: any) => {
        this.seriesData[item.month - 1] = item.nombre_livraison;
      });
      data.TotalFraisByMonth.forEach((item: any) => {
        this.TotalFraisByMonth[item.month - 1] = item.total_frais;
      });
      data.TotalCRByMonth.forEach((item: any) => {
        this.TotalCRByMonth[item.month - 1] = item.total_cr;
      });
      this._analyticsChartNombre('["--vz-success", "--vz-primary", "--vz-danger"]');
      this._analyticsChart('["--vz-success", "--vz-primary", "--vz-danger"]');

      this._salesForecastChart('["--vz-warning", "--vz-success", "--vz-info",  "--vz-danger","--vz-primary"]');
      this._basicBarChart('["--vz-primary", "--vz-primary", "--vz-info", "--vz-info", "--vz-danger", "--vz-primary", "--vz-primary", "--vz-warning", "--vz-primary", "--vz-primary"]');
      this._SalesCategoryChart('["--vz-danger", "--vz-warning", "--vz-success",  "--vz-info","--vz-primary"]');
    });
    console.log('loaded')
  

    this._analyticsChart('["--vz-success", "--vz-primary", "--vz-danger"]');
    this._analyticsChartNombre('["--vz-success", "--vz-primary", "--vz-danger"]');
    // Chart Color Data Get Function
    this._basicBarChart('["--vz-primary", "--vz-primary", "--vz-info", "--vz-info", "--vz-danger", "--vz-primary", "--vz-primary", "--vz-warning", "--vz-primary", "--vz-primary"]');
    this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    this._salesForecastChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
  }
  test1() {

    console.log(this.bons );
    // console.log(this.statusName );
    // console.log(this.statutDelivery );
  }
  // Chart Colors Set
  selectedYear: number = 0;
  listeYear: any;



  getLivraisonParYearEtMois() {


    this.StatistiqueService.getLivraisonParYear(Number(this.year)).subscribe((data: any) => {
      this.listeLivraisonParYear = data;
      data.LivraisonsByMonth.forEach((item: any) => {
        this.seriesData[item.month - 1] = item.nombre_livraison;
      });
      this._analyticsChartNombre('["--vz-success", "--vz-primary", "--vz-danger"]');
      this._analyticsChart('["--vz-success", "--vz-primary", "--vz-danger"]');
     
      this._basicBarChart('["--vz-primary", "--vz-primary", "--vz-info", "--vz-info", "--vz-danger", "--vz-primary", "--vz-primary", "--vz-warning", "--vz-primary", "--vz-primary"]');
      this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');

      this._salesForecastChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    });


  }
  /**
 * Sales Analytics Chart
 */
  setrevenuevalue(value: any) {
    if (value == 'all') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: this.seriesData
      },]
    }
    if (value == '1M') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [24, 75, 16, 98, 19, 41, 52, 34, 28, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [99.25, 28.58, 98.74, 12.87, 107.54, 94.03, 11.24, 48.57, 22.57, 42.36, 88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [28, 22, 17, 27, 21, 11, 5, 9, 17, 29, 12, 15]
      }]
    }
    if (value == '6M') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 75, 66, 78, 29, 41, 32, 44, 58, 52, 43, 77]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [109.25, 48.58, 38.74, 57.87, 77.54, 84.03, 31.24, 18.57, 92.57, 42.36, 48.51, 56.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [12, 22, 17, 27, 1, 51, 5, 9, 7, 29, 12, 35]
      }]
    }
    if (value == '1Y') {
      this.analyticsChart.series = [{
        name: 'Orders',
        type: 'area',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
      }, {
        name: 'Earnings',
        type: 'bar',
        data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57]
      }, {
        name: 'Refunds',
        type: 'line',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
      }]
    }
  }
  private _salesForecastChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.salesForecastChart = {
        series:  this.LivraisonsBySite,
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '65%',
            },
        },
        stroke: {
            show: true,
            width: 5,
            colors: ['transparent']
        },
        xaxis: {
            categories: [''],
            axisTicks: {
                show: false,
                borderType: 'solid',
                color: '#78909C',
                height: 6,
                offsetX: 0,
                offsetY: 0
            },
            title: {
                text: 'Total Forecasted Value',
                offsetX: 0,
                offsetY: -30,
                style: {
                    color: '#78909C',
                    fontSize: '12px',
                    fontWeight: 400,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (value: any) {
                    return value ;
                }
            },
            tickAmount: 4,
            min: 0
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontWeight: 500,
            offsetX: 0,
            offsetY: -14,
            itemMargin: {
                horizontal: 8,
                vertical: 0
            },
            markers: {
                width: 10,
                height: 10,
            }
        },
        colors: colors
    };
}
  _analyticsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChart = {
      chart: {
        height: 370,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        dashArray: [0, 0, 8],
        width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
        name: 'Total Contre-Remboursement',
        type: 'area',
        data: this.TotalCRByMonth  || [0]
      }, {
        name: 'Total Frais Livraison',
        type: 'bar',
        data:this.TotalFraisByMonth 

      }],
      fill: {
        opacity: [0.1, 0.9, 1],
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
        size: [0, 0, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
    };
  }


  _analyticsChartNombre(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChartN = {
      chart: {
        height: 410,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        dashArray: [0, 0, 8],
        width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
        name: 'nombre livraison',
        type: 'area',
        data: this.seriesData || [0]
      },],
      fill: {
        opacity: [0.1, 0.9, 1],
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
      markers: {
        size: [0, 0, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
    };
  }
  siteNames: any;
  siteDeliveries: any;
  basicBarChart: any;
  private _basicBarChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    //this.siteNames = this.LivraisonsBySite.map((site: any) => site.site_name);
    // this.siteDeliveries = this.LivraisonsBySite.map((site: any) => site.nombre_livraison);
    this.basicBarChart = {
      series: [{
        data: this.siteDeliveries || [0],
        name: 'Sessions',
      }],
      chart: {
        type: 'bar',
        height: 436,
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: 32,
        style: {
          fontSize: '12px',
          fontWeight: 400,
          colors: ['#adb5bd']
        }
      },
      colors: colors,
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: this.siteNames,
      },
    };
  }
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }
  /**
 *  Sales Category
 */
  private _SalesCategoryChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.SalesCategoryChart = {
      series: this.statutDelivery ?? [],
      labels: this.statusName ?? [],
      chart: {
        height: 333,
        type: "donut",
      },
      legend: {
        position: "bottom",
      },
      stroke: {
        show: false
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors
    };
  }

  /**
  * Fetches the data
  */
  private fetchData() {
    this.BestSelling = BestSelling;
    this.TopSelling = TopSelling;
    this.Recentelling = Recentelling;
    this.statData = statData;
  }

  /**
 * Sale Location Map
 */
  options = {
    layers: [
      tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w", {
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: 0,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      })
    ],
    zoom: 1.1,
    center: latLng(28, 1.5)
  };
  layers = [
    circle([41.9, 12.45], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([12.05, -61.75], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
    circle([1.3, 103.8], { color: "#435fe3", opacity: 0.5, weight: 10, fillColor: "#435fe3", fillOpacity: 1, radius: 400000, }),
  ];

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

  /**
  * Swiper Vertical  
   */
  Vertical = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    vertical: true // Enable vertical sliding
  };

  /**
   * Recent Activity
   */
  toggleActivity() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.toggle('d-none');
    }

    if (document.documentElement.clientWidth <= 767) {
      const recentActivity = document.querySelector('.layout-rightside-col');
      if (recentActivity != null) {
        recentActivity.classList.add('d-block');
        recentActivity.classList.remove('d-none');
      }
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.remove('d-block');
    }
  }
  deleteId :any ; 



  onDateChange() {
    // Ensure the date range is valid and contains both start and end dates

    console.log(this.bons)
    this.filterBonsByDateRange(this.date.from, this.date.to);

  }
  filterBonsByDateRange(from: Date | null, to: Date | null) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    this.bons = this.allinvoices.filter((bon: any) => {
      const dateLivraison = new Date(bon.dateLivraison);

      if (fromDate && toDate) {


        return dateLivraison >= fromDate && dateLivraison <= toDate;
      } else if (fromDate) {


        return dateLivraison >= fromDate;
      } else if (toDate) {


        return dateLivraison <= toDate;
      } else {
               
        return  this.BonlivraisonService.getLivraisons().subscribe((data: any) => {
          this.bons = data;
          this.allinvoices = cloneDeep(data);
          this.bons = this.service.changePage(this.allinvoices)
        });
      }
    });

    console.log(this.bons);
  }


  /**
  * Multiple Delete
  */
  checkedValGet: any[] = [];
  

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    /* this.bons.forEach((x: { id: any; }) => x.id = ev.target.checked)
     var checkedVal: any[] = [];
     var result
     for (var i = 0; i < this.invoices.length; i++) {
       if (this.invoices[i].state == true) {
         result = this.invoices[i];
         checkedVal.push(result);
       }
     }
     this.checkedValGet = checkedVal
     checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  */

  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.invoices.length; i++) {
      if (this.invoices[i].state == true) {
        result = this.invoices[i];
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  }


  // Sort Data
  onSort(column: any) {
    this.bons = this.service.onSort(column, this.bons)
  }

  statusFilter() {
    if (this.status != '') {
      this.invoices = this.allinvoices.filter((invoice: any) => invoice.status == this.status);
    } else {
      this.invoices = this.allinvoices
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    // this.orderes = this.allorderes.filter(country => country.status == status);

    if (changeEvent.nextId === 1) {

    }
    if (changeEvent.nextId === 2) {
      // this.orderes = this.allorderes.filter((order: any) => order.status == 'Delivered');
    }
    if (changeEvent.nextId === 3) {

    }
    if (changeEvent.nextId === 4) {

    }
    if (changeEvent.nextId === 5) {

    }
  }
  performSearch(): void {
    this.searchResults = this.allinvoices.filter((item: any) => {
      return (
        item.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.dateCreation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.utilisateur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.expediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresseExpediteur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.adresseDestinataire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.Destinataire.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.bons = this.service.changePage(this.searchResults)
  }

  changePage() {
    this.bons = this.service.changePage(this.allinvoices);
  }


  getStatusText(statut: number | string): string {
    const statusNumber = typeof statut === 'string' ? parseInt(statut, 10) : statut;


    switch (statusNumber) {
      case 0: return 'Créé';
      case 1: return 'En Cours';  // ou tout autre texte approprié
      case 2: return 'Livré';
      case 3: return 'Clôturé ';   // ou tout autre texte approprié
      default: return 'N/A';
    }
  }


  getBadgeClasses(statut: string): string {
    switch (statut) {
      case '0': return 'badge bg-danger-subtle text-danger';
      case '1': return 'badge bg-warning-subtle text-warning';
      case '2': return 'badge bg-success-subtle text-success';
      case '3': return 'badge bg-secondary-subtle text-secondary';
      default: return 'badge bg-secondary-subtle text-secondary'; // Valeur par défaut
    }
  }


}
