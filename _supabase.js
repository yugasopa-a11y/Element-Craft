import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('elements')
        .select('*')
        .order('discovery_count', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { name, description, emoji, category, rarity, parents } = req.body;
      const { data, error } = await supabase
        .from('elements')
        .upsert({ 
          name, 
          description, 
          emoji, 
          category, 
          rarity,
          discovery_count: 1
        }, { 
          onConflict: 'name' 
        })
        .select()
        .single();
      if (error) throw error;
      
      // Store combination
      if (parents && parents.length === 2) {
        await supabase.from('combinations').upsert({
          element1: parents[0],
          element2: parents[1],
          result: name
        }, { onConflict: 'element1,element2' });
      }
      
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { name } = req.body;
      const { data: current } = await supabase
        .from('elements')
        .select('discovery_count')
        .eq('name', name)
        .single();
      
      const { data, error } = await supabase
        .from('elements')
        .update({ discovery_count: (current?.discovery_count || 0) + 1 })
        .eq('name', name)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}