import React, { Component } from "react";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      products: [],
    };
  }
  fetchProducData() {
    this.setState({
      isLoaded: false,
      products: "",
    });
    if (this.props.input) {
      fetch("http://localhost:3035/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: this.props.input,
        }),
      })
        .then((response) => response.json())
        .then(
          // handle the result
          (result) => {
            this.setState({
              isLoaded: true,
              products: result,
            });
          },
          // Handle error
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.input != nextProps.input) {
      this.fetchProducData();
    }
  }

  render() {
    const { error, isLoaded, products } = this.state;
    if (error) {
      return <div>Error</div>;
    } else if (!isLoaded) {
      return <div></div>;
    } else {
      return (
        <div>
          <ol>
            {products.map((product) => (
              <li key={product.id} align="start">
                <div>
                  <img src={product.picture} width="30" height="30" />
                </div>
                <div>
                  <p>{product.name}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    }
  }
}

export default Product;
