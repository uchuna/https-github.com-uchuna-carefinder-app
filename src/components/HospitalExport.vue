<template>
  <div class="py-10">
    <p class="text-violet-500 bg-gray-300 text-center text-xl font-semibold mb-4 py-3">Export Hospitals</p>
    <button @click="exportHospitals('csv')"
      class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200 mb-4 mr-10">
      Export Hospitals as CSV
    </button>
    <button @click="exportHospitals('json')" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 mb-4">
        Export Hospitals as JSON
      </button>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';


interface Hospital {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email?: string;
}

export default defineComponent({
  data() {
    return {
      hospitals: [
      {
    id: '1',
    name: "Ivory Hospital Limited",
    address: "175 FAULKS ROAD BY POWERLINE, ABA",
    phoneNumber: "2347065758585",
    email: '',
    state: 'Abia, All state',
    provider: 'Hospital',
  },
  {
    id: '2',
    name: "Simeone Specialist Hospital",
    address: "2/4 ABAGANA STREET, OFF 156 ABA- OWERRI ROAD, OPP EJINAKA BUS STOP, UMUOCHA, ABA",
    phoneNumber: "2347066768686",
    email: '',
    state: 'Abia, All state',
    provider: 'Hospital',
  },
  {
    id: '3',
    name: "St. Vincent Hospital",
    address: "9, Old Timber Road, off Aba road, Umuahia",
    phoneNumber: "2347067778787",
    email: '',
    state: 'Abia, All state',
    provider: 'Hospital',
  },
  {
    id: '4',
    name: "Kings Care Hospital",
    address: "PLOT 2181,IBB WAY WUSE ZONE 4 , ABUJA",
    phoneNumber: "2347067778787",
    email: '',
    state: 'Abuja, All state',
    provider: 'Hospital',
  },
  {
    id: '5',
    name: "The Limi Hospital",
    address: "PLOT 1487, LEE MOSES ISEKO STREET, CBD, ABUJA",
    phoneNumber: "2347067778787",
    email: '',
    state: 'Abuja, All state',
    provider: 'Hospital',
  },
  {
    id: '6',
    name: "MICHAEL CROSS SPECIALIST HOSPITAL",
    address: "Karu, Abuja",
    phoneNumber: "08026378305, 08144960037",
    email: "michaelcrossspecialist@gmail.com",
    state: 'Abuja, All state',
    provider: 'Hospital',
  },
  {
    id: '7',
    name: "Aniyun Hospital Ltd",
    address: "3, Femi Aderibigbe Close, Ifako, Gbagada, Lagos",
    phoneNumber: "",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '8',
    name: "Araba Medical Centre",
    address: "122, Ekoro-Agbelekale Road, Big Joy B/stop, Abule Egba, Lagos.",
    phoneNumber: "08173968091",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '9',
    name: "Blue Cross Hospital",
    address: "48, Ijaiye road, Ogba, (Beside UBA, Ikeja), Lagos.",
    phoneNumber: "09069955756",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '10',
    name: "BRONK PREMIERE HOSPITAL",
    address: "Oshota b/stop, After Elepe b/stop, Ijede Road, Ikorodu, Lagos.",
    phoneNumber: "08092868311",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '11',
    name: "Divine Medical Centre",
    address: "53, Norman Williams Street, Off Ribadu Road, South West, Ikoyi, Lagos.",
    phoneNumber: "07087859429",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '12',
    name: "Faith Care Hospital",
    address: "32 Road House 29, Festac Town, Lagos.",
    phoneNumber: "08092669363",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '13',
    name: "Faleti Medical Centre",
    address: "98, Bale Street, New Road, b/stop, Olodi Apapa, Lagos.",
    phoneNumber: "08023116848",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '14',
    name: "Germaine Health Centre",
    address: "Lekki Expressway , Lekki, Lagos.",
    phoneNumber: "07034856977",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '15',
    name: "Renaissance Medical Services Ltd",
    address: "8B, Elsie Femi-Pearse Street, off Adeola Odeku, Victoria Island, Lagos",
    phoneNumber: "016325425",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '16',
    name: "Lifeline Children Hospital - Lekki",
    address: "1, Augustine Anozie Street, Off Admiralty Way, Lekki Phase 1, Lagos",
    phoneNumber: "07086403513",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '17',
    name: "Doren Specialist Hospital",
    address: "1, Kemfat Road, Thomas Village, Lagos-Epe Exp. Way, Ajah Lagos",
    phoneNumber: "08023062100",
    email: "",
    state: 'Lagos, All state',
    provider: 'Hospital',
  },
  {
    id: '18',
    name: "Cri Medi Clinic- VGC",
    address: "Vgc, shopping mall , VGC, Lagos.",
    phoneNumber: "08131982761",
    email: "",
    state: 'Lagos, All state',
    provider: 'Clinic',
  },
  {
    id: '19',
    name: "Critical Rescue International (CRI Medi clinic)",
    address: "26,Talabi street,Boet Estate, ABC Bus stop, off Adeniyi Jones, Ikeja, Lagos.",
    phoneNumber: "0700 000 0199",
    email: "",
    state: 'Lagos, All state',
    provider: 'Clinic',
  },
  {
    id: '20',
    name: "CHARITOS BO HOSPITAL",
    address: "Plot D22, Aco Estate, Opposite Godab Estate, life camp, Abuja, FCT, Nigeria",
    phoneNumber: "08037268905",
    email: "",
    state: 'Abuja, All state',
    provider: 'Clinic',
  },
  {
    id: '21',
    name: "IMMANUEL LIFE DIALYSIS CENTRE",
    address: "31 ISIOKPO STREET, OPPOSITE THE FOOTBALL FIELD, D/LINE, PORT HARCOURT, RIVERS STATE",
    phoneNumber: "08033411192",
    email: "",
    state: 'Rivers, All state',
    provider: 'Clinic',
  },
  {
    id: '22',
    name: "AMAZING GRACE CLINIC",
    address: "Unity Close, behind Divine Power Ministry Airport Road Rumuodumanya, PORT HARCOURT, RIVERS STATE",
    phoneNumber: "08115503321",
    email: "",
    state: 'Rivers, All state',
    provider: 'Clinic',
  },
  {
    id: '23',
    name: "GURJIYA HEALTH FACILITY",
    address: "Along minjibir road, kano",
    phoneNumber: "08064580721",
    email: "",
    state: 'Kano, All state',
    provider: 'Clinic',
  },
  {
    id: '24',
    name: "The Riverside Clinic Port Harcourt",
    address: "21 Habour road Port Harcourt, River State",
    phoneNumber: "08033063834 08055166244",
    email: "",
    state: 'Rivers, All state',
    provider: 'Clinic',
  },
  {
    id: '25',
    name: "Foresight Clinic",
    address: "No 7 Thabal tseka street, wuse2 Abuja",
    phoneNumber: "08082446965",
    email: "",
    state: 'Abuja, All state',
    provider: 'Clinic',
  },
  {
    id: '26',
    name: "MENOVAS CONSULTANT CLINICS",
    address: "Plot 53 Road B Bentell Villa Estate Gaduwa District, Lokogoma, Abuja.",
    phoneNumber: "08101077518",
    email: "",
    state: 'Abuja, All state',
    provider: 'Clinic',
  },
  {
    id: '27',
    name: "Diplomatic Vilage Clinic",
    address: "NO 1 C.A.N ODOZOR DRIVE, OFF OLUSEGUN OBASANJO WAY, OPPOSITE ETERNA FILLING STATION, CENTRAL BUSINESS DISTRICT, Abuja.",
    phoneNumber: "07066107444",
    email: "",
    state: 'Abuja, All state',
    provider: 'Clinic',
  },
  {
    id: '28',
    name: "Eyelanders Eyeclinic",
    address: "July 5th Mall, 19b, Durosinmi Etti, Lekki Phase 1, Lagos",
    phoneNumber: "08137744749",
    email: "",
    state: 'Lagos, All state',
    provider: 'Optical Center',
  },
  {
    id: '29',
    name: "Eyelanders Eyeclinic",
    address: "187, Igbosere Road, Opposite Lagos High Court Lagos Island",
    phoneNumber: "08143172293",
    email: "",
    state: 'Lagos, All state',
    provider: 'Optical Center',
  },
  {
    id: '30',
    name: "Radiant Optics Ltd - Ikoyi",
    address: "152, Awolowo Road, Ikoyi, Lagos.",
    phoneNumber: "08170585620",
    email: "",
    state: 'Lagos, All state',
    provider: 'Optical Center',
  },
  {
    id: '31',
    name: "Vision Capital Eye Hospital -V/I",
    address: "Plot 1438, Sanusi Fafunwa Street, V/I, Lagos.",
    phoneNumber: "09053518432",
    email: "",
    state: 'Lagos, All state',
    provider: 'Optical Center',
  },
  {
    id: '32',
    name: "Mega Vision Eye Clinic - Yaba",
    address: "3, Hughes Avenue, Alagomeji, Yaba, Lagos.",
    phoneNumber: "08023132290",
    email: "",
    state: 'Lagos, All state',
    provider: 'Optical Center',
  },
  {
    id: '33',
    name: "Niger Optical Services",
    address: "NO. 152 Niger Bridge Approach Road MCC, Onitsha, Anambara.",
    phoneNumber: "08056005535",
    email: "",
    state: 'Anambara, All state',
    provider: 'Optical Center',
  },
  {
    id: '34',
    name: "Beracca Eye Clinic Limited- Port harcourt",
    address: "9, Rumuogba Estate Portharcourt by Genesis Bustop, River State",
    phoneNumber: "08136915301",
    email: "",
    state: 'Rivers, All state',
    provider: 'Optical Center',
  },
  {
    id: '35',
    name: "C and C Ophthalmics Limited",
    address: "41, King Perekule street, GRA phase 2 , PortHarcourt, River State",
    phoneNumber: "+2348153653341",
    email: "",
    state: 'Rivers, All state',
    provider: 'Optical Center',
  },
  {
    id: '36',
    name: "VISION CARE EYE CLINIC",
    address: "PLOT 131/132, STADIUM ROAD, RUMUOMASI, PORT HARCOURT, RIVERS STATE.",
    phoneNumber: "08034928210",
    email: "",
    state: 'Rivers, All state',
    provider: 'Optical Center',
  },
  {
    id: '37',
    name: "LOCUS EYE CLINIC",
    address: "3,Fez crescent off kumasi crescent off aminu kano crescent behind dominos pizza WUSE 2, Abuja.",
    phoneNumber: "08120892898",
    email: "",
    state: 'Abuja, All state',
    provider: 'Optical Center',
  },
  {
    id: '38',
    name: "FIRST OPTICIANS EYE CLINIC",
    address: "SUIT A5 MELITA PLAZA OFF GIMBIA STREET AREA 11 GARKI Abuja.",
    phoneNumber: "09079437278",
    email: "",
    state: 'Abuja, All state',
    provider: 'Optical Center',
  },
  {
    id: '39',
    name: "Kyutis Clinic",
    address: "2A, Raymond Njoku Street, Ikoyi, Lagos.",
    phoneNumber: "014541881",
    email: "",
    state: 'Lagos, All state',
    provider: 'Dermatological',
  },
  {
    id: '40',
    name: "Jlt Specialist Clinic & Skin Centre",
    address: "1st floor , 213 igbosere road ,Lagos island",
    phoneNumber: "0808 026 9048",
    email: "",
    state: 'Lagos, All state',
    provider: 'Dermatological',
  },
  {
    id: '41',
    name: "ALTHEA SPECIALTY CLINICS",
    address: "NO 18, MALABO STREET, OFF AJESA STREET, AMINU KANO CRESCENT, WUSE 2 ABUJA.",
    phoneNumber: "08184123705",
    email: "",
    state: 'Abuja, All state',
    provider: 'Dermatological',
  },
  {
    id: '42',
    name: "Phoenix Derma Aesthetics & Laser Clinic",
    address: "12b Agoro Odiyan Street, off Adeola Odeku, Victoria Island, Lagos.",
    phoneNumber: "+234 913 760 0376",
    email: "",
    state: 'Lagos, All state',
    provider: 'Dermatological',
  },
  {
    id: '43',
    name: "Hygei Dental & Eye Clinic",
    address: "3, Creek Road, Colonel's Estate, Bogije Town, Ibeju -Lekki, KM 32, Lekki-Epe Expressway, Lagos.",
    phoneNumber: "07087875255",
    email: "",
    state: 'Lagos, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '44',
    name: "Aristoothcrat Dental Clinic",
    address: "25, Salvation road, Opebi,Ikeja, Lagos.",
    phoneNumber: "08168331738",
    email: "",
    state: 'Lagos, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '45',
    name: "3-J Dental Clinic",
    address: "PLOT 101, EAST-WEST ROAD, RUMUODARA, P/H, River State.",
    phoneNumber: "08071557277",
    email: "",
    state: 'Rivers, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '46',
    name: "Smile Well Dental Clinic Limited",
    address: "NO 405 ORON ROAD, BY DAN BASSEY STREET MBIABONG UYO, AKWA-IBOM STATE.",
    phoneNumber: "08065336028",
    email: "",
    state: 'Akwa-Ibom, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '47',
    name: "Rainbow Dental Clinic",
    address: "5a Igun street, off Sakponba road,Ring Road Benin city.Edo State.",
    phoneNumber: "08061344613",
    email: "",
    state: 'Edo, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '48',
    name: "Austine Graces Dental Clinic",
    address: "16 UMUNACHI STREET, NEW HAVEN, ENUGU, ENUGU STATE",
    phoneNumber: "08037105828",
    email: "",
    state: 'Enugu, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '49',
    name: "ANNUNCIATION SPECIALIST HOSPITAL (DENTAL)",
    address: "24 ANNUNCIATION HOSPITAL ROAD, EMENE, ENUGU.",
    phoneNumber: "08033456704",
    email: "",
    state: 'Enugu, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '50',
    name: "Royal Dental Clinic",
    address: "51, SCHOOL ROAD, ABA, ABIA STATE",
    phoneNumber: "08063229708",
    email: "",
    state: 'Abia, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '51',
    name: "Christiana Dental Clinic",
    address: "24 AZIKIWE ROAD, UMUAHIA, ABIA STATE",
    phoneNumber: "08035815830",
    email: "",
    state: 'Abia, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '52',
    name: "GLORY DENTAL CLINIC",
    address: "MAWAY OFFICE COMPLEX, OFFICE#4, OPPOSITE HABEEB FILLING STATION, SANNGO, ILORIN, KWARA STATE",
    phoneNumber: "08065095656",
    email: "",
    state: 'Kwara, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '53',
    name: "JEM DENTAL CLINIC",
    address: "73 Suleman Barau road Suleja Niger State",
    phoneNumber: "08038627530",
    email: "",
    state: 'Niger, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '54',
    name: "Access Oral Healthcare Services",
    address: "1, Ogo-Oluwa Bankole cresent, Ibara Housing estate, Abeokuta, Ogun State",
    phoneNumber: "08094996756",
    email: "",
    state: 'Ogun, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '55',
    name: "BRIDGE DENTAL CLINIC",
    address: "39 Airport Road, opposite Tivo Supermarket, Effurun, Uvwie LGA,Delta state",
    phoneNumber: "08160090708",
    email: "",
    state: 'Delta, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '56',
    name: "Afe Babalola Multisystem Hospital (ABUAD)- Dental Center",
    address: "KM 8.5 Afe Babalola Way, Ado Ekiti,Ekiti State",
    phoneNumber: "07083125897",
    email: "",
    state: 'Ekiti, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '57',
    name: "Likky's Dental",
    address: "5, EKITI AVENUE, IJAPO ESTATE, AKURE, ONDO STATE",
    phoneNumber: "08055153396",
    email: "",
    state: 'Ondo, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '58',
    name: "Ridge Crest Dental Clinic",
    address: "Suite 12, Rot-Kay Modern Shopping Complex, Ife-Ilesa road, opposite OAUTHC, Phase 1 gate, Ile-Ife, Osun state",
    phoneNumber: "08062882989",
    email: "",
    state: 'Osun, All state',
    provider: 'Dental Clinic',
  },
  {
    id: '59',
    name: "DIVDAN-O DENTAL CLINIC",
    address: "13 KADUNA STR BY OKIGWE RD UMUAHIA",
    phoneNumber: "07038661349",
    email: "",
    state: 'Abia, All state',
    provider: 'Dental Clinic',

  },
  {
    id: '60',
    name: "Wellpath Physiotherapy And Wellness Ltd - Lekki",
    address: "Dupe Oguntade Cresent. Orile Ilasan (World Oil Petrol Station) Lekki Epe Expressway, Lekki, Lagos, Nigeria",
    phoneNumber: "08160982667",
    email: "",
    state: 'Lagos, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '61',
    name: "Wellpath Physiotherapy And Wellness Ltd - Ikoyi",
    address: "29 Ademola street, off Awolowo road Ikoyi, Lagos",
    phoneNumber: "0818 448 2119",
    email: "",
    state: 'Lagos, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '62',
    name: "HANDS PHYSIOTHERAPY CLINIC",
    address: "32 Lord lugard street,Area 11.Abuja",
    phoneNumber: "08033213323",
    email: "",
    state: 'Abuja, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '63',
    name: "NET CARE PHYSIOTHERAPY",
    address: "20 IBB AVENUE UYO, AKWA-IBOM",
    phoneNumber: "08033839314",
    email: "",
    state: 'Akwa-Ibom, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '64',
    name: "PREMIUM PHYSIOTHERAY AND DIAGNOSTICS LTD",
    address: "16 AWKA STREET BESIDE FRSC ABA ROAD PH, RIVER STATE",
    phoneNumber: "08035472879",
    email: "",
    state: 'Rivers, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '65',
    name: "HC PHYSIOTHERAPY (MOBILE SERVICES)",
    address: "Plot 877, ahoada close, off Emeka Ayaokwu street, Garki, Area 11, Abuja",
    phoneNumber: "08162207533",
    email: "",
    state: 'Abuja, All state',
    provider: 'Physiotherapy Clinic',
  },
  {
    id: '66',
    name: "Physio Centers of Africa-Asaba",
    address: "Ward E, Asaba Specialist Hospital, GRA Phase 1, Midwifery Road, Asaba, Delta State.",
    phoneNumber: "08122559597",
    email: "",
    state: 'Delta, All state',
    provider: 'Physiotherapy Clinic',
  },
      ] as Hospital[],
    };
  },
  methods: {
    exportHospitals(format: string) {
      let content: string;

      if (format === 'csv') {
        content = "data:text/csv;charset=utf-8," + this.convertToCSV(this.hospitals);
      } else if (format === 'json') {
        content = "data:text/json;charset=utf-8," + JSON.stringify(this.hospitals, null, 2);
      } else {
        console.error('Unsupported export format');
        return;
      }

      const encodedUri = encodeURI(content);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `hospitals.${format}`);
      document.body.appendChild(link);
      link.click();
    },
    convertToCSV(data: Hospital[]): string {
      const csv = data.map(hospital => Object.values(hospital).join(',')).join('\n');
      return csv;
    }
  }
});
</script>
  
<style scoped>
</style>