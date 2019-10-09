import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Row, Col, ListGroup } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";

function App() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const prev30day = date.toISOString().split("T")[0];

  const [repos, setRepos] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadFunc = page => {
    console.log(`loadFunc called ${page}`);
    const url =
      `https://api.github.com/search/repositories?` +
      `q=created:">${prev30day}"` +
      `&page=${page}` +
      `&per_page=10` +
      `&sort=stars` +
      `&order=desc`;

    axios.get(url).then(res => {
      setRepos(repos.concat(res.data.items));
      setHasMore(res.data.incomplete_results === false);
    });
  };

  return (
    <div className="App">
      <Container>
        <h1 className="mt-4 mb-4">Most Starred ★ Github Repositories</h1>
        <ListGroup className="mb-4">
          <div className="repo-list">
            <InfiniteScroll
              pageStart={0}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={
                <ListGroup.Item className="loader" key={0}>
                  Loading ...
                </ListGroup.Item>
              }
            >
              {repos.map(repo => (
                <ListGroup.Item key={repo.id}>
                  <Row>
                    <Col sm={12} md={8}>
                      <h4>{repo.name}</h4>
                    </Col>
                    <Col xs>{repo.language}</Col>
                    <Col xs>forks:{repo.forks_count}</Col>
                    <Col xs>★{repo.stargazers_count}</Col>
                  </Row>
                  <p className="mb-0">{repo.description}</p>
                </ListGroup.Item>
              ))}
            </InfiniteScroll>
          </div>
        </ListGroup>
      </Container>
    </div>
  );
}

export default App;
