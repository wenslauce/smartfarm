import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendMessageToGroq } from '@/lib/groq';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

// List of districts (same as you provided)
const districts = [
  'CHANGAMWE', 'JOMVU', 'KISAUNI', 'LIKONI', 'MVITA', 'NYALI',  
'KINANGO', 'LUNGA LUNGA', 'MSAMBWENI', 'MATUGA',  
'GANZE', 'KALOLENI', 'KILIFI NORTH', 'KILIFI SOUTH', 'MAGARINI', 'MALINDI', 'RABAI',  
'BURA', 'GALOLE', 'GARSEN',  
'LAMU EAST', 'LAMU WEST',  
'MWATATE', 'TAVETA', 'VOI', 'WUNDANYI',  
'DAADAB', 'FAFI', 'GARISSA TOWNSHIP', 'HULUGHO', 'IJARA', 'LAGDERA', 'BALAMBALA',  
'ELDAS', 'TARBAJ', 'WAJIR EAST', 'WAJIR NORTH', 'WAJIR SOUTH', 'WAJIR WEST',  
'BANISSA', 'LAFEY', 'MANDERA EAST', 'MANDERA NORTH', 'MANDERA SOUTH', 'MANDERA WEST',  
'LAISAMIS', 'MOYALE', 'NORTH HORR', 'SAKU',  
'ISIOLO', 'MERTI', 'GARBATULLA',  
'BUURI', 'IGEMBE CENTRAL', 'IGEMBE NORTH', 'IGEMBE SOUTH', 'IMENTI CENTRAL', 'IMENTI NORTH', 'IMENTI SOUTH', 'TIGANIA EAST', 'TIGANIA WEST',  
'THARAKA NORTH', 'THARAKA SOUTH', 'CHUKA', 'IGAMBANG\'OMBE', 'MAARA', 'CHIAKARIGA', 'MUTHAMBI',  
'MANYATTA', 'MBEERE NORTH', 'MBEERE SOUTH', 'RUNYENJES',  
'KITUI WEST', 'KITUI CENTRAL', 'KITUI RURAL', 'KITUI SOUTH', 'KITUI EAST', 'MWINGI NORTH', 'MWINGI WEST', 'MWINGI CENTRAL',  
'KATHIANI', 'MACHAKOS TOWN', 'MASINGA', 'MATUNGULU', 'MAVOKO', 'MWALA', 'YATTA',  
'KAITI', 'KIBWEZI WEST', 'KIBWEZI EAST', 'KILOME', 'MAKUENI', 'MBOONI',  
'KINANGOP', 'KIPIPIRI', 'NDARAGWA', 'OL KALOU', 'OL JORO OROK',  
'KIENI EAST', 'KIENI WEST', 'MATHIRA EAST', 'MATHIRA WEST', 'MUKURWEINI', 'NYERI TOWN', 'OTHEYA', 'TETU',  
'KIRINYAGA CENTRAL', 'KIRINYAGA EAST', 'KIRINYAGA WEST', 'MWEA EAST', 'MWEA WEST',  
'GATANGA', 'KAHURO', 'KANDARA', 'KANGEMA', 'KIGUMO', 'KIHARU', 'MATHIOYA', 'MURANG\'A SOUTH',  
'GATUNDU NORTH', 'GATUNDU SOUTH', 'GITHUNGURI', 'JUJA', 'KABETE', 'KIAMBAA', 'KIAMBU', 'KIKUYU', 'LIMURU', 'RUIRU', 'THIKA TOWN', 'LARI',  
'LOIMA', 'TURKANA CENTRAL', 'TURKANA EAST', 'TURKANA NORTH', 'TURKANA SOUTH',  
'CENTRAL POKOT', 'NORTH POKOT', 'POKOT SOUTH', 'WEST POKOT',  
'SAMBURU EAST', 'SAMBURU NORTH', 'SAMBURU WEST',  
'CHERANGANY', 'ENDEBESS', 'KIMININI', 'KWANZA', 'SABOTI',  
'AINABKOI', 'KAPSERET', 'KESSES', 'MOIBEN', 'SOY', 'TURBO',  
'KEIYO NORTH', 'KEIYO SOUTH', 'MARAKWET EAST', 'MARAKWET WEST',  
'ALDAI', 'CHESUMEI', 'EMGWEN', 'MOSOP', 'NANDI HILLS', 'TINDIRET',  
'BARINGO CENTRAL', 'BARINGO NORTH', 'BARINGO SOUTH', 'ELDAMA RAVINE', 'MOGOTIO', 'TIATY',  
'LAIKIPIA CENTRAL', 'LAIKIPIA EAST', 'LAIKIPIA NORTH', 'LAIKIPIA WEST', 'NYAHURURU',  
'BAHATI', 'GILGIL', 'KURESOI NORTH', 'KURESOI SOUTH', 'MOLO', 'NAIVASHA', 'NAKURU TOWN EAST', 'NAKURU TOWN WEST', 'NJORO', 'RONGAI', 'SUBUKIA',  
'NAROK EAST', 'NAROK NORTH', 'NAROK SOUTH', 'NAROK WEST', 'TRANSMARA EAST', 'TRANSMARA WEST',  
'ISINYA', 'KAJIADO CENTRAL', 'KAJIADO NORTH', 'LOITOKITOK', 'MASHUURU',  
'AINAMOI', 'BELGUT', 'BURETI', 'KIPKELION EAST', 'KIPKELION WEST', 'SOIN/SIGOWET',  
'BOMET CENTRAL', 'BOMET EAST', 'CHEPALUNGU', 'KONOIN', 'SOTIK',  
'BUTERE', 'KAKAMEGA CENTRAL', 'KAKAMEGA EAST', 'KAKAMEGA NORTH', 'KAKAMEGA SOUTH', 'KHWISERO', 'LUGARI', 'LUKUYANI', 'LURAMBI', 'MATETE', 'MUMIAS', 'MUTUNGU', 'NAVAKHOLO',  
'EMUHAYA', 'HAMISI', 'LUANDA', 'BOND', 'UGENYA', 'UGUNJA',  
'BUMULA', 'KABUCHAI', 'KANDUYI', 'KIMILILI', 'MT ELGON', 'SIRISIA', 'TONGAREN', 'WEBUYE EAST', 'WEBUYE WEST',  
'BUDALANGI', 'BUTULA', 'FUNYULA', 'NAMBELE', 'TESO NORTH', 'TESO SOUTH',  
'ALEG USONGA', 'BONDO', 'GEM', 'RARIEDA', 'UGENYA', 'UGUNJA',  
'KISUMU CENTRAL', 'KISUMU EAST', 'KISUMU WEST', 'MUHORONI', 'NYAKACH', 'NYANDO', 'SEME',  
'HOMABAY TOWN', 'KABONDO KASIPUL', 'KARACHUONYO', 'KASIPUL', 'MBITA', 'NDHIWA', 'RANGWE', 'SUBA',  
'AWENDO', 'KURIA EAST', 'KURIA WEST', 'MABERA', 'NTIMARU', 'RONGO', 'SUNA EAST', 'SUNA WEST', 'URIRI',  
'BOBASI', 'BOMACHOGE BORABU', 'BOMACHOGE CHACHE', 'BONCHARI', 'KITUTU CHACHE NORTH', 'KITUTU CHACHE SOUTH', 'NYARIBARI CHACHE', 'NYARIBARI MASABA', 'SOUTH MUGIRANGO',  
'BORABU', 'MANGA', 'MASABA NORTH', 'NYAMIRA NORTH', 'NYAMIRA SOUTH',  
'DAGORETTI NORTH', 'DAGORETTI SOUTH', 'EMBAKASI CENTRAL', 'EMBAKASI EAST', 'EMBAKASI NORTH', 'EMBAKASI SOUTH', 'EMBAKASI WEST', 'KAMUKUNJI', 'KASARANI', 'KIBRA', 'LANG\'ATA', 'MAKADARA', 'MATHARE', 'ROYSAMBU', 'RUARAKA', 'STAREHE', 'WESTLANDS'  
];

const crops = ['coffee', 'Rice', 'Corn', 'Wheat', 'Maize']; // Add more crops as needed
const seasons = ['long rains', 'short rains', ];

export const CropSelectionForm = () => {
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('');
  const [land, setLand] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const prompt = `As an agricultural expert AI, analyze and provide comprehensive recommendations for the following farming scenario in Kenya:

Location: ${district}
Crop: ${crop}
Growing Season: ${season}
Land Area: ${land} acres

Please provide a detailed analysis including:

1. Yield Prediction
- Expected yield range based on local conditions
- Yield per acre estimates
- Total expected production

2. Growing Conditions Analysis
- Suitability of ${district} for ${crop}
- Seasonal considerations for ${season}
- Typical weather patterns
- Soil characteristics

3. Optimization Recommendations
- Best practices for ${crop} in this region
- Optimal planting schedule
- Resource management
- Risk mitigation strategies

4. Economic Analysis
- Market potential in ${district}
- Expected ROI
- Value chain opportunities
- Storage and distribution considerations

5. Sustainability Considerations
- Environmental impact
- Long-term soil health
- Water management
- Climate resilience

Format the response with clear sections and actionable insights.`;

      const response = await sendMessageToGroq([{
        role: 'user',
        content: prompt
      }]);

      setAnalysis(response.content);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="w-full md:w-1/2 p-4">
        <Card className="h-full border border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">Crop Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="district">Select District</Label>
                <Select value={district} onValueChange={setDistrict} required>
                  <SelectTrigger id="district" className="bg-white">
                    <SelectValue placeholder="Choose a district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((dist, index) => (
                      <SelectItem key={index} value={dist}>{dist}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Select Season</Label>
                <Select value={season} onValueChange={setSeason} required>
                  <SelectTrigger id="season" className="bg-white">
                    <SelectValue placeholder="Choose a season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((s, index) => (
                      <SelectItem key={index} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop">Select Crop</Label>
                <Select value={crop} onValueChange={setCrop} required>
                  <SelectTrigger id="crop" className="bg-white">
                    <SelectValue placeholder="Choose a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((c, index) => (
                      <SelectItem key={index} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="land">Enter Your Land (in acres)</Label>
                <Input
                  id="land"
                  type="number"
                  placeholder="e.g., 5.5"
                  value={land}
                  onChange={(e) => setLand(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Analysis'
                )}
              </Button>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="w-full md:w-1/2 p-4 mt-4 md:mt-0">
        <Card className="h-full border border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="prose prose-green max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg">Your analysis will appear here after submission.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};