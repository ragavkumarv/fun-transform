import React from "react";
import ReactDOM from "react-dom";
import { BlockMath } from "react-katex";

import "./styles.css";
import "katex/dist/katex.min.css";

const SELECTOR = ".explanation > span, .katex-html > .base span";

class Colorized extends React.Component {
  state = {
    activeColor: "null"
  };

  onMouseLeave = e => {
    // reset active color to black
    this.setState({
      activeColor: "null"
    });

    // get all root spans in katex equation
    // FIXME: do NOT use \\textcolor inside another \\textcolor or you'll die
    const cmps = [].slice.call(this.refs.math.querySelectorAll(SELECTOR));

    // reset all grayscale filters
    for (let i of cmps) {
      i.style.filter = "none";
    }
  };

  onMouseMove = e => {
    const t = e.target;
    const c = t.style.color;

    // make sure component only reacts to important elements to prevent performance issues
    if (t.nodeName !== "SPAN" && t.className !== "explanation") return;

    // for equation spans without any specific color and also the main katex container
    // the value of element.style.color is "", so it's necessary to reset active color
    if (c === "") {
      // react will take care of unnecessary updates, so don't worry
      this.setState({
        activeColor: "null"
      });

      return;
    }

    // finally if everything's checked and cursor is certainly on a colored span,
    // then change the active color
    this.setState({
      activeColor: c
    });
  };

  componentDidUpdate() {
    const cmps = [].slice.call(this.refs.math.querySelectorAll(SELECTOR));

    // if cursor is not on an equation, remove all grayscale filters
    // react will take care of unnecessary updates
    // don't worry about performance issues
    if (this.state.activeColor === "null") {
      for (let i of cmps) {
        i.style.filter = "none";
      }
      return;
    }

    // reset all grayscale filters and get ready for appying new ones
    for (let i of cmps) {
      i.style.filter = "none";
    }

    // filter all spans with different colors
    const coloredCmps = cmps
      .filter(e => e.style.color !== this.state.activeColor)
      .filter(e => e.style.color !== "");

    // apply grayscale filter to all of them
    for (let i of coloredCmps) {
      i.style.filter = "grayscale(1)";
    }
  }

  render() {
    // TODO: move content to props.children
    return (
      <div
        className="colorized"
        onMouseLeave={e => this.onMouseLeave(e)}
        onMouseMove={e => this.onMouseMove(e)}
      >
        <h1 className="title">2.1 Fourier Transform</h1>
        <div ref="math" className="math">
          <BlockMath>
            {`
              \\textcolor{#B794F4}{{f}(\\textcolor{#48BB78}{\\xi})} =
              \\textcolor{#F56565}{\\int_{-\\infty}^{+\\infty}} \\!
              \\textcolor{#63B3ED}{f(x)} \\;
              \\textcolor{#F6AD55}{e}
              ^{
                \\textcolor{#F6AD55}{-} \\,
                \\textcolor{#D53F8C}{{2\\pi}} \\,
                \\textcolor{#F6AD55}{i} \\,
                \\textcolor{#F6AD55}{x} \\,
                \\textcolor{#48BB78}{\\xi}
              } \\,
              \\textcolor{#F56565}{\\mathrm{d}x}
              `}
          </BlockMath>
          <div className="explanation">
            To find <span style={{ color: "#B794F4" }}>energy</span> at a{" "}
            <span style={{ color: "#48BB78" }}>particular frequency</span>,{" "}
            <span style={{ color: "#F6AD55" }}>spin</span>{" "}
            <span style={{ color: "#63B3ED" }}>your wave</span> around a{" "}
            <span style={{ color: "#D53F8C" }}>circle</span> and get it's{" "}
            <span style={{ color: "#F56565" }}>center of mass</span>.
          </div>
        </div>
      </div>
    );
  }
}

// mounting react
const rootElement = document.getElementById("root");
ReactDOM.render(<Colorized />, rootElement);
