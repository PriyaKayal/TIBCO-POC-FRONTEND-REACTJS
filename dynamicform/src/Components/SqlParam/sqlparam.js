import React, { Component } from 'react';

class SqlParam extends Component {
    state = {
        key: "", value: ""
    }
    constructor(props) {
        super(props)
    }
    handleChange = action => event => {
        if (action == "key") {
            this.setState({ key: event.target.value });
        }
        else if (action == "value") {
            this.setState({ value: event.target.value });
        }
    }
    handleBlocks = () => {
        let block = [];
        for (let i = 1; i <= this.props.inputBindingParams; i++) {
            block.push(<div>
                <div class="row">
                    <div class="col-25">
                        <label className="form-label" >
                            KEY
                            </label>
                    </div>
                    <div class="col-75">
                        <input
                            id="keyField"
                            label="ParamKey"
                            type="text"
                            onChange={this.handleChange("key")}
                        />
                    </div>
                    <div class="col-25">
                        <label className="form-label" >
                            VALUE
                        </label>
                    </div>
                    <div class="col-75">
                        <input
                            id="valueField"
                            label="ParamValue "
                            type="number"
                            onChange={this.handleChange("value")}
                        />
                    </div>
                </div>
                {/* <p>
                    key: {this.state.key} value: {this.state.value}
                </p> */}

            </div>
            )
        }
        return block;
    }
    render() {
        return (
            <div className="form-group">
                {this.handleBlocks()}
            </div>
        )
    }
}
export default SqlParam;
