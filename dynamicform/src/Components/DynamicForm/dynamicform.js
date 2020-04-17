import React, { Component } from "react";
import { Button, IconButton, Grid, TextField, TextareaAutosize } from "@material-ui/core";
class DynamicForm extends Component {
  state = {
    checkBoxVal: this.props.model.Form.data.filter((key) => {
      return key.key === "checkbox";
    })[0].values,
    noOfParams: 0,
    name: "",
    num: "",
    newinputbindings: [],
    inputbindings: [{ name: "", num: "" }]   
  };
  constructor(props) {
    super(props);
  }
  onMoveUp(key) {
    if (key === 0) return;
    let items = this.state.newinputbindings;
    const index = key - 1;
    const itemAbove = items[index];
    items[key - 1] = items[key];
    items[key] = itemAbove;
    this.setState({ items });   
  }
  onMoveDown(key) {
    let items = this.state.newinputbindings;
    if (key === items.length - 1) return;
    const index = key + 1;
    const itemBelow = items[index];
    items[key + 1] = items[key];
    items[key] = itemBelow;
    this.setState({ items });
  }
  setNoOfParams = (event) => {
    let count = 0;
    let value = event.target.value;
    let minus = event.target.value[event.target.value.length - 1];
    console.log(value);
    for (let index = 0; index <= value.length; index++) {
      if (minus === undefined && count > 0) {
        count = count - 1;
      } else if (value[index] === "?") {
        count = count + 1;
      }
    }
    this.setState({ noOfParams: count }, () => {
      console.log(
        "count = " + count + "this.state.noOfParams = " + this.state.noOfParams
      );
    });
  };
  handleInputBindingsNameChange = (idx) => (evt) => {
    const inputs = this.state.inputbindings.map((bindingfields, sidx) => {
      if (idx !== sidx) return bindingfields;
      return { ...bindingfields, name: evt.target.value };
    });
    this.setState({ newinputbindings: inputs });
    this.setState({ inputbindings: inputs });
  };
  handleInputBindingsNumChange = (idx) => (evt) => {
    const inputs = this.state.inputbindings.map((bindingfields, sidx) => {
      if (idx !== sidx) return bindingfields;
      return { ...bindingfields, num: evt.target.value };
    });
    this.setState({ newinputbindings: inputs });
    this.setState({ inputbindings: inputs });
  };
  handleAddInputBindings = () => {
    this.setState({
      inputbindings: this.state.inputbindings.concat([{ name: "", num: "" }]),
    });
  };
  handleRemoveInputBindings = (idx) => () => {
    this.setState({
      inputbindings: this.state.inputbindings.filter((s, sidx) => idx !== sidx),
      newinputbindings: this.state.newinputbindings.filter(
        (s, sidx) => idx !== sidx
      ),
    });
  };
  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit(this.state);
    const { name, inputbindings } = this.state;
    if (inputbindings.length === this.state.noOfParams) {
      alert(`Used: ${name} with ${inputbindings.length} inputbindings`);
    } else {
      alert("Number of parameters expected in the query doesn't match with the count of parameters defined.");
    }
  };
  handleAllChecked = (event) => {
    let checkBoxVal = this.state.checkBoxVal;
    checkBoxVal.forEach((e) => (e.isChecked = event.target.checked));
    this.setState({ checkBoxVal: checkBoxVal });
  };
  handleCheckChieldElement = (event) => {
    let checkBoxVal = this.state.checkBoxVal;
    checkBoxVal.forEach((e) => {
      if (e.value === event.target.value) e.isChecked = event.target.checked;
    });
    this.setState({ checkBoxVal: checkBoxVal });
  };
  renderForm = () => {
    let model = this.props.model.Form.data;
    let form = model.map((element) => {
      let key = element.key;
      let label = element.label;
      let props = element.props || {};
      let type = element.type;
      let values = element.values || {};
      let isSql = element.isSql || "";
      let i = 0;
      // let items = element.items;
      if (type === "text" || type === "number") {
        return (
          <Grid key={key}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <label className="form-label" key={"label" + key} htmlFor={key}>
                  {label}
                </label>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="filled"
                  {...props}
                  ref={(keyin) => {
                    this[key] = keyin;
                  }}
                  type={type}
                  key={"input" + key}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }
      if (type === "textarea") {
        return (
          <Grid key={key}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <label className="form-label" key={"label" + key} htmlFor={key}>
                  {label}
                </label>
              </Grid>
              <Grid item xs={8} className="margin-0">
                <TextareaAutosize
                  rowsMin={3}
                  variant="filled"
                  className="textarea"
                  {...props}
                  ref={(keyin) => {
                    this[key] = keyin;
                  }}
                  key={"input" + key}
                  onChange={this.setNoOfParams}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }
      if (type === "dropdown") {
        return (
          <Grid container spacing={3} key={key}>
            <Grid item xs={4}>
              <label className="form-label" key={"label" + key} htmlFor={key}>
                {label}
              </label>
            </Grid>
            <Grid item xs={8}>
              <select className="form-input" {...props}>
                <option className="form-label" value="">
                  select an option
                </option>
                {values.map((values) => (
                  <option className="form-label" value={values}>
                    {values}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
        );
      }
      if (type === "params") {
        return (
          <Grid container spacing={3} key={key}>
            <Grid item xs={4} className="bindings">
              <label className="form-label" key={"label" + key} htmlFor={key}>
                {label}
              </label>
            </Grid>
            <Grid item xs={8}>
              <ul className="form-input">
                {this.state.newinputbindings.map((item, key) => (
                  <li className="form-input" key={key}>
                    <div className="paramsId">{key + 1}</div>
                    <div className="paramsName">{item.name}</div>
                    <IconButton
                      onClick={() => this.onMoveUp(key)}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      &#x25B2;
                    </IconButton>
                    <IconButton
                      onClick={() => this.onMoveDown(key)}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      &#x25BC;
                    </IconButton>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        );
      }
      if (type === "inputbindings") {
        return (
          <Grid container spacing={3} justify="space-evenly" key={key}>
            <Grid item xs={12} className="bindings">
              <label className="form-label" key={"label" + key} htmlFor={key}>
                {label}
              </label>
              <Button
                type="button"
                onClick={this.handleAddInputBindings}
                variant="contained"
                size="small"
                color="primary"
              >
                {" "}
                +
              </Button>
            </Grid>
            {this.state.inputbindings.map((bindingfields, idx) => (
              <Grid container spacing={2} justify="center" className="bindings">
                <Grid item xs={4}>
                  <TextField
                    variant="filled"
                    className="left-margin"
                    {...props}
                    type="text"
                    placeholder={`Param ${idx + 1}`}
                    value={bindingfields.name}
                    onChange={this.handleInputBindingsNameChange(idx)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="filled"
                    type="text"
                    placeholder={`Value ${idx + 1}`}
                    value={bindingfields.num}
                    onChange={this.handleInputBindingsNumChange(idx)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={this.handleRemoveInputBindings(idx)}
                    variant="contained"
                    size="large"
                    color="primary"
                  >
                   -
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={4}>
              <Button type="submit" variant="contained" size="large" color="primary">
                CREATE
              </Button>
            </Grid>
          </Grid>
        );
      }
    });
    return form;
  };
  render() {
    let title = this.props.model.Form.title || "Dynamic Form";
    return (
      <div>
        <div class="topcontainer">
          <div className="headtitle"> CONVERTZULTOLOC PROCESS</div>
        </div>
        <form
          className="dynamic-form"
          onSubmit={(e) => {
            this.onSubmit(e);
          }}
        >
          <div class="container">
            <div className="title">{title}</div>
          </div>
          <div className="add-form">{this.renderForm()}</div>
        </form>
      </div>
    );
  }
}
export default DynamicForm;
