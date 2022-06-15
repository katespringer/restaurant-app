import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Dishes from "./dishes";

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";
import { render } from "react-dom";

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);

  const GET_RESTAURANTS = gql`
    query GetRestaurants {
      restaurants {
        data {
          id
          attributes {
            name
            description
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data, error, loading } = useQuery(GET_RESTAURANTS);
  console.log(`GET_RESTAURANTS: ${GET_RESTAURANTS}`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  console.log("data", data.restaurants.data); //log: undefined
  console.log("error", error); //log: [Error: Network request failed]
  console.log(Object.keys(data).length);
  console.log("loading", loading); //log: false
  console.log(`Query Data: ${data.restaurants}`);

  let searchQuery =
    data.restaurants.data.filter((res) => {
      return res.attributes.name.toLowerCase().includes(props.search);
    }) || [];
  console.log("result searchQuery", searchQuery);

  let restId = searchQuery[0] ? searchQuery[0].id : null;
  console.log("result restId-restaurantList", restId);
  // definet renderer for Dishes
  const renderDishes = (restaurant_ID) => {
    return <Dishes restId={restaurant_ID}> </Dishes>;
  };
  renderDishes(restId);

  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => (
      <Col xs="6" sm="4" key={res.id}>
        <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
          <CardImg
            top={true}
            style={{ height: 200 }}
            src={
              `http://localhost:1337` +
              res.attributes.image.data[0].attributes.url
            }
          />
          <CardBody>
            <CardTitle tag="h5">{res.attributes.name}</CardTitle>
            <CardText>{res.attributes.description}</CardText>
          </CardBody>
          <div className="card-footer">
            <Button color="info" onClick={() => setRestaurantID(res.id)}>
              {res.attributes.name}
            </Button>
          </div>
        </Card>
      </Col>
    ));

    return (
      <Container>
        <Row xs="3">{restList}</Row>
        <Row xs="3">{renderDishes(restId)}</Row>
      </Container>
    );
  } else {
    return <h1> No Restaurants Found</h1>;
  }
}
export default RestaurantList;
