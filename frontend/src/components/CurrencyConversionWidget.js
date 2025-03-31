import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import axios from 'axios';
import PublicIcon from '@mui/icons-material/Public';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// Currency options with symbols
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
];

const CurrencyConversionWidget = ({ title = 'Currency Exchange Rates' }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('GBP');
  const [amount, setAmount] = useState(100);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        // Try to fetch from our backend first
        let ratesData = {};
        try {
          const { data } = await axios.get('/api/donations/exchange-rates/refresh/');
          
          if (data.success && data.rates) {
            // Convert API response to our format
            data.rates.forEach(rate => {
              ratesData[rate.target_currency] = rate.rate;
            });
            setLastUpdated(new Date(data.last_updated));
          } else {
            throw new Error('Invalid response format');
          }
        } catch (apiError) {
          // Fallback to a public API
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          
          if (response.data && response.data.rates) {
            ratesData = response.data.rates;
            setLastUpdated(new Date());
          }
        }
        
        // If we still don't have rates, use defaults
        if (Object.keys(ratesData).length === 0) {
          ratesData = {
            USD: 1.0,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.32,
            CAD: 1.25,
            AUD: 1.33
          };
          setLastUpdated(new Date());
        }
        
        setExchangeRates(ratesData);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
    // Refresh rates every 30 minutes
    const intervalId = setInterval(fetchRates, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Convert amount based on selected currencies
  const convertAmount = (amount, from, to) => {
    if (!exchangeRates[from] || !exchangeRates[to]) return amount;
    
    // Convert to USD first (base currency for our rates)
    const amountInUSD = from === 'USD' ? amount : amount / exchangeRates[from];
    
    // Then convert from USD to target currency
    return to === 'USD' ? amountInUSD : amountInUSD * exchangeRates[to];
  };

  // Find currency name by code
  const getCurrencyByCode = (code) => {
    return currencies.find(c => c.code === code) || { name: code, symbol: '' };
  };

  // Format date for display
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>From Currency</InputLabel>
                  <Select
                    value={baseCurrency}
                    label="From Currency"
                    onChange={(e) => setBaseCurrency(e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>To Currency</InputLabel>
                  <Select
                    value={targetCurrency}
                    label="To Currency"
                    onChange={(e) => setTargetCurrency(e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              my: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                {`${getCurrencyByCode(baseCurrency).symbol}${amount}`}
              </Typography>
              <CompareArrowsIcon sx={{ mx: 1, color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {`${getCurrencyByCode(targetCurrency).symbol}${convertAmount(amount, baseCurrency, targetCurrency).toFixed(2)}`}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="caption" color="text.secondary">
              Exchange rates as of {formatLastUpdated(lastUpdated)}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Common rates (1 {baseCurrency}):
              </Typography>
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                {currencies
                  .filter(c => c.code !== baseCurrency)
                  .slice(0, 3)
                  .map(currency => (
                    <Grid item xs={4} key={currency.code}>
                      <Typography variant="body2">
                        {currency.code}: {(convertAmount(1, baseCurrency, currency.code)).toFixed(4)}
                      </Typography>
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConversionWidget; 