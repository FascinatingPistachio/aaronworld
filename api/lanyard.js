export default async function handler(req, res) {
  const id = req.query.id;
  const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
  const data = await response.json();
  
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS allow
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(data);
}
