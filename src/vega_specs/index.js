// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import AxesHistChart from "./charts/AxesHistChart";
import HeatChart from "./charts/HeatChart";
import XHistChart from "./charts/XHistChart";
import YHistChart from "./charts/YHistChart";

function getChart(props) {
  if (props.config.x_hist && props.config.y_hist) {
    return AxesHistChart(props);
  } else if (props.config.x_hist) {
    return XHistChart(props);
  } else if (props.config.y_hist) {
    return YHistChart(props);
  } else {
    return HeatChart(props);
  }
}

export default getChart;
