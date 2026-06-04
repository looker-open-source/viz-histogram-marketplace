// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import ScatterLabels from "./ScatterLabels";
import { useScatterplot } from "./Scatterplot";
import ReferenceLine from "./ReferenceLine";

function useLayers({
  layers,
  data,
  config,
  tooltipFields,
  dataProperties,
  width,
  height,
  mainDimensions,
  minX,
  minY,
  maxX,
  maxY,
}) {
  if (config["layer_points"]) {
    layers.push(
      useScatterplot({
        config,
        tooltipFields,
        dataProperties,
        width,
        height,
        mainDimensions,
      })
    );
  }
  if (config["layer_points"] && config["point_labels"]) {
    layers.push(ScatterLabels({ config, dataProperties, mainDimensions }));
  }
  if (config["reference_line_x"]) {
    layers.push(
      ReferenceLine({
        axis: "x",
        min: minY,
        max: maxY,
        config,
        data,
      })
    );
  }
  if (config["reference_line_y"]) {
    layers.push(
      ReferenceLine({
        axis: "y",
        min: minX,
        max: maxX,
        config,
        data,
      })
    );
  }
}

export default useLayers;
