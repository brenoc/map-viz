import React, { Component } from "react";
import PropTypes from "prop-types";
import ControlBox from "../ControlBox";
import Autocomplete from "../AutoComplete";
import axios from "axios";

class Institutions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      institutions: [],
      loading: true
    };

    this.requestToken = null;
  }

  componentDidMount() {
    this.requestToken = axios.CancelToken.source();
    axios("/api/institutions", {
      cancelToken: this.requestToken.token
    }).then(response => {
      this.setState({
        loading: false,
        institutions: response.data.institutions
      });
    });
  }

  componentWillUnmount() {
    if (this.requestToken) {
      this.requestToken.cancel();
    }
  }

  handleChange = value => {
    this.setState({ value });
  };

  handleSelect = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    return (
      <ControlBox title={"Convênios"}>
        {this.state.loading
          ? "Carregando"
          : <Autocomplete
              value={this.state.value}
              items={this.state.institutions}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            />}
      </ControlBox>
    );
  }
}

Institutions.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Institutions;
