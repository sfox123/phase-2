const Items = [
  {
    tam: 'சிவப்பு அரிசி',
    image: 'rice.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 10,
    price: 188,
    sin: 'රතු සහල්',
    id: '1',
    eng: 'Rice (Red)',
  },
  {
    tam: 'உலர் ஸ்ப்ராட்ஸ்',
    image: 'sprats.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 1,
    price: 1100,
    sin: 'වියළි හාල්මැස්සන්',
    id: '10',
    eng: 'Dry Sprats',
  },
  {
    tam: 'ரின் மீன்',
    image: 'tin.jpeg',
    unit: 'TIN',
    max: 1,
    price: 650,
    sin: 'ටින් මාළු',
    fixed: true,
    id: '11',
    quantity: 1,
    eng: 'Tin fish',
  },
  {
    tam: 'முட்டை',
    image: 'egg.png',
    unit: 'nos',
    fixed: true,
    quantity: 10,
    max: 10,
    sin: 'බිත්තර',
    id: '12',
    eng: 'Eggs',
    price: 500,
  },
  {
    tam: 'அயோடின் உப்பு',
    image: 'salt.png',
    fixed: true,
    unit: 'G',
    quantity: 400,
    max: 400,
    price: 110,
    sin: 'අයඩින් ලුණු',
    id: '13',
    eng: 'Iodized Salt',
  },
  {
    tam: 'தே.எண்ணெய்',
    image: 'coconut-oil.png',
    fixed: true,
    unit: 'L',
    quantity: 1,
    max: 2,
    price: 550,
    sin: 'පොල් තෙල්',
    id: '14',
    eng: 'Coconut oil',
  },
  {
    tam: 'சோயா',
    image: 'soya.png',
    fixed: true,
    unit: 'G',
    price: 300,
    sin: 'සෝයා',
    id: '15',
    eng: 'Soya',
    max: 500,
    quantity: 500,
  },
  {
    tam: 'மிளகாய் தூள்',
    image: 'red-chilly-powder.png',
    unit: 'G',
    fixed: true,
    quantity: 250,
    price: 375,
    sin: 'මිරිස් කුඩු',
    id: '16',
    max: 250,
    eng: 'Chili Powder',
  },
  {
    tam: 'மஞ்சள் தூள்',
    image: 'turmeric.png',
    fixed: true,
    unit: 'G',
    quantity: 50,
    price: 125,
    sin: 'කහ',
    id: '17',
    eng: 'Turmeric',
    max: 50,
  },
  {
    tam: 'கறி பவுடர்',
    image: 'curry.png',
    fixed: true,
    unit: 'G',
    quantity: 250,
    price: 500,
    sin: 'තුනපහ කුඩු',
    id: '18',
    eng: 'Curry Powder',
    max: 250,
  },
  {
    tam: 'செத்தல்',
    image: 'dry-chilly.png',
    fixed: true,
    unit: 'G',
    price: 275,
    sin: 'මිරිස්',
    id: '19',
    quantity: 250,
    max: 250,
    eng: 'Dry Chili',
  },
  {
    tam: 'கோ. மாவு',
    image: 'wheat.png',
    fixed: true,
    unit: 'KG',
    max: 5,
    price: 200,
    sin: 'තිරිඟු පිටි',
    id: '2',
    eng: 'Wheat Flour',
    quantity: 1,
  },
  {
    tam: 'மல்லி',
    image: 'coriander.png',
    fixed: true,
    unit: 'G',
    quantity: 250,
    price: 100,
    sin: 'කොත්තමල්ලි',
    id: '20',
    eng: 'Coriander',
    max: 250,
  },
  {
    tam: 'மிளகு',
    image: 'pepper.png',
    fixed: true,
    unit: 'G',
    quantity: 50,
    price: 120,
    sin: 'ගම්මිරිස්',
    id: '21',
    eng: 'Pepper',
    max: 50,
  },
  {
    tam: 'பூண்டு',
    image: 'garlic.png',
    fixed: true,
    unit: 'G',
    quantity: 500,
    sin: 'සුදුලූණු',
    id: '22',
    eng: 'Garlic',
    max: 500,
    price: 260,
  },
  {
    tam: 'லைப் போய்',
    image: 'life.png',
    unit: 'PKT',
    fixed: false,
    quantity: 1,
    max: 1,
    price: 160,
    sin: 'ලයිෆ්බෝය්  සබන්',
    id: '23',
    eng: 'LifeBouy Soap',
  },
  {
    tam: 'சோப்பு',
    image: 'baby.png',
    unit: 'PKT',
    fixed: false,
    quantity: 1,
    sin: 'බේබි සබන්',
    id: '24',
    eng: 'Baby Soap',
    price: 190,
    max: 1,
  },
  {
    tam: 'விம் சோப்பு',
    image: 'vim.png',
    unit: 'PKT',
    fixed: false,
    quantity: 1,
    sin: 'Vim සබන්',
    id: '25',
    eng: 'Vim Soap',
    price: 235,
    max: 1,
  },
  {
    tam: 'ஈவா',
    image: 'eva.png',
    unit: 'PKT',
    quantity: 1,
    max: 1,
    price: 270,
    sin: 'ඊවා',
    id: '26',
    eng: 'Eva',
  },
  {
    tam: 'பனதால்',
    image: 'Panadol.jpg',
    unit: 'CRD',
    quantity: 1,
    max: 1,
    price: 50,
    sin: 'පැනඩෝල්',
    id: '27',
    eng: 'Panadol',
  },
  {
    tam: 'வேறு பொருட்கள்',
    image: 'other.png',
    fixed: false,
    unit: 'LOT',
    quantity: 1,
    id: '32',
    max: 691,
    sin: 'අනික්කුත්',
    eng: 'Other',
  },
  {
    tam: 'அ. மாவு',
    image: 'rice-flour.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 2,
    price: 218,
    sin: 'හාල් පිටි',
    id: '3',
    eng: 'Rice Flour',
  },
  {
    tam: 'தேயிலை',
    image: 'tea.png',
    fixed: true,
    unit: 'G',
    quantity: 500,
    price: 750,
    sin: 'තේ කොළ',
    id: '4',
    eng: 'Tea',
    max: 500,
  },
  {
    tam: 'சீனி',
    image: 'sugar.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 2,
    price: 268,
    sin: 'සීනි',
    id: '5',
    eng: 'Sugar',
  },
  {
    tam: 'பால் பொடி',
    image: 'milk-powder.png',
    fixed: true,
    unit: 'G',
    max: 1,
    price: 1160,
    sin: 'කිරි පිටි',
    id: '6',
    eng: 'Milk Powder',
    quantity: 400,
  },
  {
    tam: 'பா.பயறு',
    image: 'green.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 1,
    price: 1000,
    sin: 'මුං ඇට',
    id: '7',
    eng: 'Green Gramme',
  },
  {
    tam: 'பருப்பு',
    image: 'dhal.png',
    fixed: true,
    unit: 'KG',
    sin: 'මයිසූර් පරිප්පු',
    id: '8',
    eng: 'Red Dhal',
    max: 4,
    quantity: 1,
    price: 1120,
  },
  {
    tam: 'கடலை',
    image: 'chick.png',
    fixed: true,
    unit: 'KG',
    quantity: 1,
    max: 1,
    price: 650,
    sin: 'කඩල',
    id: '9',
    eng: 'Chickpeas',
  },
  {
    tam: 'தீப்பெட்டி',
    image: 'matches.png',
    fixed: false,
    unit: 'BOX',
    quantity: 2,
    max: 1,
    price: 240,
    sin: 'ගිනිකූරු පෙට්ටි',
    id: '29',
    eng: 'Matches',
  },
  {
    tam: 'பற்பசை',
    image: 'toothpaste.png',
    fixed: false,
    unit: 'BOX',
    quantity: 2,
    max: 1,
    price: 360,
    sin: 'දන්තාලේප',
    id: '30',
    eng: 'Toothpaste',
  },
  {
    tam: 'சலவைத்தூள்',
    image: 'w-powder.jpg',
    fixed: false,
    unit: 'G',
    quantity: 500,
    max: 500,
    price: 220,
    sin: 'රෙදි සෝදන කුඩු',
    id: '31',
    eng: 'Washing powder',
  },
  {
    tam: 'மலிபன் மாறி',
    image: 'marie.png',
    fixed: false,
    unit: 'G',
    quantity: 240,
    max: 240,
    price: 179,
    sin: 'මැලිබන් මාරි ',
    id: '28',
    eng: 'Maliban Marie',
  },
];

export default Items;
