import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { useState, useContext } from "react";
import AppContext from "./context";

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
} from "reactstrap";
function Dishes({ restId }) {
  const [restaurantID, setRestaurantID] = useState();
  console.log("restID-dishes", restId);
  const { addItem } = useContext(AppContext);

  const GET_RESTAURANT_DISHES = gql`
    query GetRestaurantsDishes($id: ID!) {
      restaurant(id: $id) {
        data {
          id
          attributes {
            name
            dishes {
              data {
                id
                attributes {
                  name
                  description
                  price
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
        }
      }
    }
  `;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;
  console.log("data-restaurant-dishes", data.restaurant);
  console.log(`Query Data-disshes: ${data.restaurant}`);

  let restaurant = data.restaurant;

  if (restId > 0) {
    return (
      <>
        {restaurant.data.attributes.dishes.data.map((res) => (
          <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
            <Card style={{ margin: "0 10px" }}>
              <CardImg
                top={true}
                style={{ height: 150, width: 150 }}
                src={`http://localhost:1337${res.attributes.image.data[0].attributes.url}`}
              />
              <CardBody>
                <CardTitle>{res.attributes.name}</CardTitle>
                <CardText>{res.attributes.description}</CardText>
              </CardBody>
              <div className="card-footer">
                <Button
                  color="info"
                  outline
                  onClick={() => {
                    addItem(res);
                    console.log(" addItem(res)", res);
                  }}
                >
                  + Add To Cart
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </>
    );
  } else {
    return <h1> No Dishes</h1>;
  }
}
export default Dishes;
