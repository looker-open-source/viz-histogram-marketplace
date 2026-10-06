// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import { FILTERED_LABELS } from "../../common/options";

function ScatterLabels({ config, dataProperties, mainDimensions }) {
  return {
    mark: {
      type: "text",
      align: "left",
      angle: config["point_labels_angle"],
      dx: config["point_labels_x_offset"],
      dy: config["point_labels_y_offset"],
      fontSize: config["point_labels_font_size"],
    },
    encoding: {
      x: {
        field: config["x"],
        type: "quantitative",
      },
      y: {
        field: config["y"],
        type: "quantitative",
      },
      text: {
        field: dataProperties[FILTERED_LABELS]
          ? FILTERED_LABELS
          : mainDimensions[0],
      },
    },
  };
}

export default ScatterLabels;
