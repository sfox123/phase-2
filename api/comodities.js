const Items = [
  {
    tam: 'சிவப்பு அரிசி',
    image: 'rice.png',
    fixed: true,
    unit: 'KG',
    district: 2,
    quantity: 1,
    max: 15,
    price: 208,
    sin: 'රතු සහල්',
    id: '1',
    eng: 'Rice (Red)',
  },
  {
    tam: 'வெள்ளை அரிசி',
    image: 'white-rice.png',
    fixed: true,
    unit: 'KG',
    district: 3,
    quantity: 1,
    max: 15,
    price: 225,
    sin: 'රතු සහල්',
    id: '2',
    eng: 'Rice (Red)',
  },
  {
    tam: 'ஙூடில்',
    image: 'white-rice.png',
    fixed: true,
    unit: 'PKT',
    district: 3,
    quantity: 1,
    max: 1,
    price: 410,
    sin: 'නූඩුල්ස්',
    id: '3',
    eng: 'Noodles',
  },
  {
    tam: 'கோ. மாவு',
    image: 'wheat.png',
    fixed: true,
    unit: 'KG',
    max: 5,
    price: 200,
    sin: 'තිරිඟු පිටි',
    id: '4',
    eng: 'Wheat Flour',
    district: 1,
    quantity: 1,
  },
  {
    tam: 'சி.அ. மாவு',
    image: 'rice-flour.png',
    fixed: true,
    unit: 'KG',
    district: 1,
    quantity: 1,
    max: 5,
    price: 250,
    sin: 'හාල් පිටි',
    id: '5',
    eng: 'R.Rice Flour',
  },
  {
    tam: 'தேயிலை',
    image: 'tea.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 500,
    price: 850,
    sin: 'තේ කොළ',
    id: '6',
    eng: 'Tea',
    max: 500,
  },
  {
    tam: 'சீனி',
    image: 'sugar.png',
    fixed: true,
    unit: 'KG',
    district: 1,
    quantity: 1,
    max: 2,
    price: 320,
    sin: 'සීනි',
    id: '7',
    eng: 'Sugar',
  },
  {
    tam: 'பால் பொடி',
    image: 'milk-powder.png',
    fixed: true,
    unit: 'G',
    max: 400,
    price: 1080,
    sin: 'කිරි පිටි',
    id: '8',
    eng: 'Milk Powder',
    district: 1,
    quantity: 400,
  },
  {
    tam: 'பா.பயறு',
    image: 'green.png',
    fixed: true,
    unit: 'KG',
    district: 2,
    quantity: 1,
    max: 1,
    price: 905,
    sin: 'මුං ඇට',
    id: '9',
    eng: 'Green Gramme',
  },
  {
    tam: 'பருப்பு',
    image: 'dhal.png',
    fixed: true,
    unit: 'KG',
    sin: 'මයිසූර් පරිප්පු',
    id: '10',
    eng: 'Red Dhal',
    max: 2,
    district: 2,
    quantity: 1,
    price: 340,
  },
  {
    tam: 'பருப்பு',
    image: 'dhal.png',
    fixed: true,
    unit: 'G',
    sin: 'මයිසූර් පරිප්පු',
    id: '11',
    eng: 'Red Dhal',
    max: 2500,
    district: 3,
    quantity: 500,
    price: 340,
  },
  {
    tam: 'கடலை',
    image: 'chick.png',
    fixed: true,
    unit: 'KG',
    district: 1,
    quantity: 1,
    max: 1,
    price: 750,
    sin: 'කඩල',
    id: '12',
    eng: 'Chickpeas',
  },
  {
    tam: 'உலர் ஸ்ப்ராட்ஸ்',
    image: 'sprats.png',
    fixed: true,
    unit: 'KG',
    district: 1,
    quantity: 1,
    max: 1,
    price: 1250,
    sin: 'වියළි හාල්මැස්සන්',
    id: '13',
    eng: 'Dry Sprats',
  },
  {
    tam: 'அயோடின் உப்பு',
    image: 'salt.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 400,
    max: 400,
    price: 120,
    sin: 'අයඩින් ලුණු',
    id: '14',
    eng: 'Iodized Salt',
  },
  {
    tam: 'தே.எண்ணெய்',
    image: 'coconut-oil.png',
    fixed: true,
    unit: 'L',
    district: 1,
    quantity: 1,
    max: 2,
    price: 600,
    sin: 'පොල් තෙල්',
    id: '15',
    eng: 'Coconut oil',
  },
  {
    tam: 'சோயா',
    image: 'soya.png',
    fixed: true,
    unit: 'G',
    price: 400,
    sin: 'සෝයා',
    id: '16',
    eng: 'Soya',
    max: 500,
    district: 1,
    quantity: 500,
  },
  {
    tam: 'மிளகாய் தூள்',
    image: 'red-chilly-powder.png',
    unit: 'G',
    fixed: true,
    district: 2,
    quantity: 250,
    price: 440,
    sin: 'මිරිස් කුඩු',
    id: '17',
    max: 250,
    eng: 'Chili Powder',
  },
  {
    tam: 'மிளகாய் தூள்',
    image: 'red-chilly-powder.png',
    unit: 'G',
    fixed: true,
    district: 3,
    quantity: 250,
    price: 460,
    sin: 'මිරිස් කුඩු',
    id: '18',
    max: 250,
    eng: 'Chili Powder',
  },
  {
    tam: 'மஞ்சள் தூள்',
    image: 'turmeric.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 50,
    price: 140,
    sin: 'කහ',
    id: '19',
    eng: 'Turmeric',
    max: 50,
  },
  {
    tam: 'கறி பவுடர்',
    image: 'curry.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 250,
    price: 450,
    sin: 'තුනපහ කුඩු',
    id: '20',
    eng: 'Curry Powder',
    max: 250,
  },
  {
    tam: 'செத்தல்',
    image: 'dry-chilly.png',
    fixed: true,
    unit: 'G',
    price: 350,
    sin: 'මිරිස්',
    id: '21',
    district: 1,
    quantity: 250,
    max: 250,
    eng: 'Dry Chili',
  },
  {
    tam: 'மல்லி',
    image: 'coriander.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 250,
    price: 110,
    sin: 'කොත්තමල්ලි',
    id: '22',
    eng: 'Coriander',
    max: 250,
  },
  {
    tam: 'மிளகு',
    image: 'pepper.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 50,
    price: 130,
    sin: 'ගම්මිරිස්',
    id: '23',
    eng: 'Pepper',
    max: 50,
  },
  {
    tam: 'பூண்டு',
    image: 'garlic.png',
    fixed: true,
    unit: 'G',
    district: 1,
    quantity: 500,
    sin: 'සුදුලූණු',
    id: '24',
    eng: 'Garlic',
    max: 500,
    price: 300,
  },
  {
    tam: 'லைப் போய்',
    image: 'life.png',
    unit: 'PKT',
    fixed: false,
    district: 1,
    quantity: 1,
    max: 2,
    price: 160,
    sin: 'ලයිෆ්බෝය්  සබන්',
    id: '25',
    eng: 'LifeBouy Soap',
  },
  {
    tam: 'வேறு பொருட்கள்',
    image: 'other.png',
    fixed: false,
    unit: 'LOT',
    district: 1,
    quantity: 1,
    id: '26',
    max: 1,
    sin: 'අනික්කුත්',
    eng: 'Other',
  },
  {
    tam: 'பேபி சோப்',
    image: 'baby.png',
    unit: 'PKT',
    fixed: false,
    district: 1,
    quantity: 1,
    sin: 'බේබි සබන්',
    id: '27',
    eng: 'Baby Soap',
    price: 155,
    max: 2,
  },
  {
    tam: 'விம் சோப்',
    image: 'vim.png',
    unit: 'PKT',
    fixed: false,
    district: 3,
    quantity: 1,
    sin: 'Vim සබන්',
    id: '28',
    eng: 'Vim Soap',
    price: 70,
    max: 1,
  },
  {
    tam: 'ஈவா',
    image: 'eva.png',
    unit: 'PKT',
    district: 1,
    quantity: 1,
    max: 1,
    price: 250,
    sin: 'ඊවා',
    id: '29',
    eng: 'Eva',
  },
  {
    tam: 'மலிபன் மாறி',
    image: 'marie.png',
    fixed: false,
    unit: 'PKT',
    district: 1,
    quantity: 1,
    max: 1,
    price: 230,
    sin: 'මැලිබන් මාරි ',
    id: '30',
    eng: 'Maliban Marie',
  },
  {
    tam: 'தீப்பெட்டி',
    image: 'box.png',
    fixed: false,
    unit: 'Nos',
    district: 1,
    quantity: 1,
    max: 2,
    price: 20,
    sin: 'ගිනිපෙට්ටිය',
    id: '31',
    eng: 'Matches',
  },
];

export default Items;
