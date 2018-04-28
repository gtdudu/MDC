const QUOTES = [
  'If you want to keep a secret, you must also hide it from yourself.',
  'He who controls the past controls the future. He who controls the present controls the past.',
  'If you want a picture of the future, imagine a boot stamping on a human face—forever.',
  'War is peace. Freedom is slavery.  Ignorance is strength.',
  'Big Brother is Watching You.',
  'Doublethink means the power of holding two contradictory beliefs in one’s mind simultaneously, and accepting both of them.',
  'Until they became conscious they will never rebel, and until after they have rebelled they cannot become conscious.',
  'The choice for mankind lies between freedom and happiness and for the great bulk of mankind, happiness is better.',
  'The Party seeks power entirely for its own sake. We are not interested in the good of others; we are interested solely in power, pure power.',
  'Power is in tearing human minds to pieces and putting them together again in new shapes of your own choosing.',
  'Orthodoxy means not thinking–not needing to think. Orthodoxy is unconsciousness.'
];

module.exports = [{
  method: 'GET',
  path: '/api',
  handler(request, reply) {
    reply('Hello, world!');
  }
},
{
  method: 'GET',
  path: '/apihello',
  handler(request, reply) {
    reply('Hello, fzeafeza!');
  }
},
{
  method: 'GET',
  path: '/api/quotes',
  handler(request, reply) {
    reply(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }
}];
