import React, { Component } from "react";
// import toxicity from "@tensorflow/tfjs";

export default class App extends Component {
  state = {
    text: "",
    loading: false,
    prediction: [],
  };

  componentDidMount() {}

  checkProbability = () => {
    if (this.state.text.length == 0) {
      alert("Field cannot be empty");
      return;
    }

    this.setState({ loading: true, prediction: [] });
    const threshold = 0.9;
    /*global toxicity*/
    toxicity
      .load(threshold)
      .then((model) => {
        const sentences = [this.state.text];

        model
          .classify(sentences)
          .then((prediction) => {
            console.log(prediction);
            this.setState({ loading: false, prediction });
          })
          .catch((e) => {
            console.log("unable to classify the sentence");
            this.setState({ loading: false });
          });
      })
      .catch((e) => {
        alert("unable to load model");
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <center>
          <h1 id="heading" style={{ marginTop: 20 }}>
            Mob Detection
          </h1>
        </center>
        <div style={{ marginTop: 50 }} />
        <div
          style={{
            width: "50%",
          }}
          class="form-floating mb-3"
        >
          <input
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
            type="text"
            class="form-control"
            placeholder="Write here!"
            style={{ width: "100%" }}
          />
          <label for="floatingInput">Sentence</label>
        </div>
        <br />
        <button
          onClick={() => this.checkProbability()}
          type="button"
          class="btn btn-primary"
        >
          Search
        </button>
        <br />
        <br />
        {this.state.prediction.length > 0 ? (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            className="row"
          >
            <div className="col-md-6">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">type</th>
                    <th scope="col">result</th>
                  </tr>
                </thead>
                {this.state.prediction.map((item, i) => (
                  <tr key={i}>
                    <td>
                      {item.label == "identity_attack"
                        ? "Identity Atttack"
                        : item.label == "severe_toxicity"
                        ? "Severe Bad Language"
                        : item.label == "sexual_explicit"
                        ? "Sexual Explicit"
                        : item.label}
                    </td>
                    <td
                      style={{
                        color:
                          item.results[0]?.probabilities[0] <
                          item.results[0]?.probabilities[1]
                            ? "red"
                            : "green",
                      }}
                    >
                      {item.results[0]?.probabilities[0] <
                      item.results[0]?.probabilities[1]
                        ? "True"
                        : "False"}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        ) : this.state.loading ? (
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : null}
      </div>
    );
  }
}
