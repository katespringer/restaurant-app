import {gql,useQuery} from '@apollo/client';
import Dishes from "./dishes"
import {useContext, useState} from 'react';


import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col} from "reactstrap";

function RestaurantList(props){
  const[restaurantID, setRestaurantID] = useState(0)
  const {cart } = useContext(AppContext);
  const [state, setState] = useState(cart)
  const GET_RESTAURANTS = gql`
  {
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
 const { loading, error, data } = useQuery(GET_RESTAURANTS)
 if (loading) return <p>Loading...</p>;
 if (error) return <p>ERROR</p>;
 if (!data) return <p>Not found</p>;
 console.log(`Query Data: ${data.restaurants}`)


if (data.restaurants?.data?.length) {
    const searchQuery = data.restaurants.data.filter((query) =>
      query.attributes.name.toLowerCase().includes(props.search)
    );
let restId = searchQuery[0].id

// definet renderer for Dishes
  const renderDishes = (restaurantID) => {
    return (<Dishes restId={restaurantID}> </Dishes>)
  };
if(searchQuery.length > 0){
  const restList = searchQuery.map(({ id, attributes }) => (
    <Col xs="6" sm="4" key={id}>
      <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
        <CardImg
          top={true}
          style={{ height: 200 }}
           src={`http://localhost:1337${attributes.image.data.attributes.url}`}
        />
        <CardBody>
          <CardText>{attributes.description}</CardText>
        </CardBody>
        <div className="card-footer">

        <Button color="info" onClick={()=> setRestaurantID(id)}>{attributes.name}</Button>
            </div>
      </Card>
    </Col>
  ))}

  return(

    <Container>
    <Row xs='3'>
      {restList}
    </Row>

    <Row xs='3'>
    {renderDishes(restaurantID)}
    </Row>

    </Container>

  )
} else {
  return <h1> No Restaurants Found</h1>
}
}
export default RestaurantList
