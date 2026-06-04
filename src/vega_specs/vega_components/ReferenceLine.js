// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import { getPercentile } from "../../common/utils/data";

function ReferenceLine({ axis, config, data, min, max }) {
  const percentile = getPercentile(
    config[`reference_line_${axis}_p`],
    config[axis],
    data
  );
  return {
    name: `refLine${axis}`,
    mark: {
      type: "rule",
    },
    encoding: {
      x: { datum: axis === "x" ? percentile : min },
      y: { datum: axis === "x" ? min : percentile },
      x2: { datum: axis === "x" ? percentile : max },
      y2: { datum: axis === "x" ? max : percentile },
      color: { value: "red" },
      size: { value: config[`reference_line_${axis}_width`] },
      strokeDash: { value: [4, 4] },
    },
  };
}

export default ReferenceLine;
