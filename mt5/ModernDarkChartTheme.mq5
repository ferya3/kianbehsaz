//+------------------------------------------------------------------+
//|                                      ModernDarkChartTheme.mq5    |
//|                              Modern Dark Chart Theme for MT5     |
//+------------------------------------------------------------------+
#property version   "1.00"
#property script_show_inputs
#property description "Modern Dark Chart Theme - a clean, grid-free dark workspace"
#property description "with teal/red candles and a gold accent scale."
#property description "Run once on any chart; optionally save it as a template."

//--- scope -------------------------------------------------------------
input group             "Scope"
input bool              InpApplyAllCharts = false;          // Apply to every open chart
input bool              InpSaveTemplate   = true;           // Save the result as a template
input string            InpTemplateName   = "ModernDark";   // Template name (without .tpl)

//--- palette -----------------------------------------------------------
input group             "Palette"
input color             InpBackground     = C'8,9,12';      // Chart background
input color             InpForeground     = C'226,180,74';  // Axes, labels, text
input color             InpGrid           = C'26,28,33';    // Grid (used only if grid is on)
input color             InpCandleBull     = C'0,201,167';   // Bull candle body
input color             InpCandleBear     = C'233,56,79';   // Bear candle body
input color             InpBarUp          = C'0,201,167';   // Bar up / candle outline (bull)
input color             InpBarDown        = C'233,56,79';   // Bar down / candle outline (bear)
input color             InpLineChart      = C'226,180,74';  // Line chart / doji
input color             InpVolumeColor    = C'0,201,167';   // Volumes and position levels
input color             InpBidColor       = C'0,201,167';   // Bid line
input color             InpAskColor       = C'233,56,79';   // Ask line
input color             InpLastColor      = C'226,180,74';  // Last price line
input color             InpStopLevel      = C'255,86,86';   // Stop loss / take profit levels

//--- layout ------------------------------------------------------------
input group             "Layout"
input bool              InpShowGrid       = false;          // Show grid
input bool              InpShowPeriodSep  = false;          // Show period separators
input ENUM_CHART_VOLUME_MODE InpVolumeMode = CHART_VOLUME_HIDE; // Volumes
input bool              InpShowOHLC       = false;          // Show OHLC header
input bool              InpShowBidLine    = true;           // Show bid line
input bool              InpShowAskLine    = false;          // Show ask line
input bool              InpShowTradeLevels= true;           // Show trade levels
input bool              InpChartShift     = true;           // Shift chart from the right edge
input bool              InpAutoScroll     = true;           // Auto scroll to the latest bar
input bool              InpColorCandles   = true;           // Colored candles (bodies filled)

//--- indicators --------------------------------------------------------
input group             "Indicators (optional)"
input bool              InpAddMA          = true;           // Add a moving average
input int               InpMAPeriod       = 50;             // MA period
input ENUM_MA_METHOD    InpMAMethod       = MODE_EMA;       // MA method
input bool              InpAddRSI         = true;           // Add RSI in a sub-window
input int               InpRSIPeriod      = 14;             // RSI period

//+------------------------------------------------------------------+
//| Script entry point                                               |
//+------------------------------------------------------------------+
void OnStart()
  {
   long charts[];
   int  total = CollectCharts(charts);

   for(int i = 0; i < total; i++)
     {
      ApplyTheme(charts[i]);
      if(InpAddMA || InpAddRSI)
         ApplyIndicators(charts[i]);
      ChartRedraw(charts[i]);
     }

   if(InpSaveTemplate)
     {
      string name = InpTemplateName;
      if(StringLen(name) == 0)
         name = "ModernDark";
      if(ChartSaveTemplate(ChartID(), name))
         PrintFormat("Modern Dark: template saved as \"%s.tpl\" (Charts > Template > Load Template).", name);
      else
         PrintFormat("Modern Dark: could not save the template \"%s\" (error %d).", name, GetLastError());
     }

   PrintFormat("Modern Dark: theme applied to %d chart(s).", total);
  }

//+------------------------------------------------------------------+
//| Build the list of charts the theme has to be applied to          |
//+------------------------------------------------------------------+
int CollectCharts(long &list[])
  {
   if(!InpApplyAllCharts)
     {
      ArrayResize(list, 1);
      list[0] = ChartID();
      return(1);
     }

   int  count = 0;
   long id    = ChartFirst();
   while(id >= 0)
     {
      ArrayResize(list, count + 1);
      list[count++] = id;
      id = ChartNext(id);
     }

   if(count == 0)                       // should not happen, but stay safe
     {
      ArrayResize(list, 1);
      list[0] = ChartID();
      count   = 1;
     }
   return(count);
  }

//+------------------------------------------------------------------+
//| Apply colors and layout to a single chart                        |
//+------------------------------------------------------------------+
void ApplyTheme(const long chart_id)
  {
//--- colors
   ChartSetInteger(chart_id, CHART_COLOR_BACKGROUND,  InpBackground);
   ChartSetInteger(chart_id, CHART_COLOR_FOREGROUND,  InpForeground);
   ChartSetInteger(chart_id, CHART_COLOR_GRID,        InpGrid);
   ChartSetInteger(chart_id, CHART_COLOR_CHART_UP,    InpBarUp);
   ChartSetInteger(chart_id, CHART_COLOR_CHART_DOWN,  InpBarDown);
   ChartSetInteger(chart_id, CHART_COLOR_CHART_LINE,  InpLineChart);
   ChartSetInteger(chart_id, CHART_COLOR_CANDLE_BULL, InpCandleBull);
   ChartSetInteger(chart_id, CHART_COLOR_CANDLE_BEAR, InpCandleBear);
   ChartSetInteger(chart_id, CHART_COLOR_VOLUME,      InpVolumeColor);
   ChartSetInteger(chart_id, CHART_COLOR_BID,         InpBidColor);
   ChartSetInteger(chart_id, CHART_COLOR_ASK,         InpAskColor);
   ChartSetInteger(chart_id, CHART_COLOR_LAST,        InpLastColor);
   ChartSetInteger(chart_id, CHART_COLOR_STOP_LEVEL,  InpStopLevel);

//--- layout
   ChartSetInteger(chart_id, CHART_MODE,              CHART_CANDLES);
   ChartSetInteger(chart_id, CHART_SHOW_GRID,         InpShowGrid);
   ChartSetInteger(chart_id, CHART_SHOW_PERIOD_SEP,   InpShowPeriodSep);
   ChartSetInteger(chart_id, CHART_SHOW_VOLUMES,      InpVolumeMode);
   ChartSetInteger(chart_id, CHART_SHOW_OHLC,         InpShowOHLC);
   ChartSetInteger(chart_id, CHART_SHOW_BID_LINE,     InpShowBidLine);
   ChartSetInteger(chart_id, CHART_SHOW_ASK_LINE,     InpShowAskLine);
   ChartSetInteger(chart_id, CHART_SHOW_TRADE_LEVELS, InpShowTradeLevels);
   ChartSetInteger(chart_id, CHART_SHIFT,             InpChartShift);
   ChartSetInteger(chart_id, CHART_AUTOSCROLL,        InpAutoScroll);
   ChartSetInteger(chart_id, CHART_FOREGROUND,        false);   // objects and indicators stay above the price chart
   ChartSetInteger(chart_id, CHART_SHOW_ONE_CLICK,    false);
   ChartSetInteger(chart_id, CHART_SHOW_DATE_SCALE,   true);
   ChartSetInteger(chart_id, CHART_SHOW_PRICE_SCALE,  true);
   ChartSetInteger(chart_id, CHART_SCALEFIX,          false);

//--- filled bodies are what makes the candles read as "clean"
   if(InpColorCandles)
     {
      ChartSetInteger(chart_id, CHART_COLOR_CHART_UP,   InpCandleBull);
      ChartSetInteger(chart_id, CHART_COLOR_CHART_DOWN, InpCandleBear);
     }
  }

//+------------------------------------------------------------------+
//| Add the moving average / RSI shown in the theme preview          |
//+------------------------------------------------------------------+
void ApplyIndicators(const long chart_id)
  {
   string          symbol = ChartSymbol(chart_id);
   ENUM_TIMEFRAMES tf     = (ENUM_TIMEFRAMES)ChartPeriod(chart_id);

   if(InpAddMA && !IndicatorExists(chart_id, 0, "MA("))
     {
      int handle = iMA(symbol, tf, InpMAPeriod, 0, InpMAMethod, PRICE_CLOSE);
      if(handle == INVALID_HANDLE)
         PrintFormat("Modern Dark: could not create the MA handle (error %d).", GetLastError());
      else
        {
         if(!ChartIndicatorAdd(chart_id, 0, handle))
            PrintFormat("Modern Dark: could not add the MA to the chart (error %d).", GetLastError());
         IndicatorRelease(handle);
        }
     }

   if(InpAddRSI && !IndicatorExistsAnyWindow(chart_id, "RSI("))
     {
      int handle = iRSI(symbol, tf, InpRSIPeriod, PRICE_CLOSE);
      if(handle == INVALID_HANDLE)
         PrintFormat("Modern Dark: could not create the RSI handle (error %d).", GetLastError());
      else
        {
         //--- passing the current window count creates a new sub-window
         int subwindow = (int)ChartGetInteger(chart_id, CHART_WINDOWS_TOTAL);
         if(!ChartIndicatorAdd(chart_id, subwindow, handle))
            PrintFormat("Modern Dark: could not add the RSI to the chart (error %d).", GetLastError());
         IndicatorRelease(handle);
        }
     }
  }

//+------------------------------------------------------------------+
//| True if a window already holds an indicator with this short name |
//+------------------------------------------------------------------+
bool IndicatorExists(const long chart_id, const int window, const string tag)
  {
   int total = ChartIndicatorsTotal(chart_id, window);
   for(int i = 0; i < total; i++)
      if(StringFind(ChartIndicatorName(chart_id, window, i), tag) >= 0)
         return(true);
   return(false);
  }

//+------------------------------------------------------------------+
//| Same check across the main window and every sub-window           |
//+------------------------------------------------------------------+
bool IndicatorExistsAnyWindow(const long chart_id, const string tag)
  {
   int windows = (int)ChartGetInteger(chart_id, CHART_WINDOWS_TOTAL);
   for(int w = 0; w < windows; w++)
      if(IndicatorExists(chart_id, w, tag))
         return(true);
   return(false);
  }
//+------------------------------------------------------------------+
