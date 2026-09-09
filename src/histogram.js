// © 2020 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import embed from "vega-embed";
import { scatterHist } from "./scatter_hist";
import { simpleHist } from "./simple_hist";
import { baseOptions } from "./common/options";
import { handleErrors } from "./common/utils/data";
import "./common/styles.css";

looker.plugins.visualizations.add({
  options: baseOptions,
  create: function (element, config) {
    var container = element.appendChild(document.createElement("div"));
    container.setAttribute("id", "my-vega");
  },

  updateAsync: function (data, element, config, queryResponse, details, done) {
    if (data.length === 0) {
      this.addError({ title: "No Results" });
      done();
      return;
    }

    if (config.bin_style === "binned_hist") {
      if (
        !handleErrors(this, queryResponse, {
          min_pivots: 0,
          max_pivots: 0,
          min_dimensions: 1,
          max_dimensions: undefined,
          min_measures: 2,
          max_measures: undefined,
        })
      ) {
        done();
        return;
      }

      scatterHist(
        data,
        element,
        config,
        queryResponse,
        details,
        done,
        this,
        embed
      );
    } else {
      if (
        !handleErrors(this, queryResponse, {
          min_pivots: 0,
          max_pivots: 0,
          min_dimensions: 1,
          max_dimensions: undefined,
          min_measures: 1,
          max_measures: undefined,
        })
      ) {
        done();
        return;
      }

      simpleHist(
        data,
        element,
        config,
        queryResponse,
        details,
        done,
        this,
        embed
      );
    }
  },
});
