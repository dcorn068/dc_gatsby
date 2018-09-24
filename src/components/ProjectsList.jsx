import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
// import Link from "gatsby-link";
import Typography from "@material-ui/core/Typography";
import SvgIcons from "./SvgIcons";
import { navigateTo } from "gatsby-link";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import OpenIcon from "@material-ui/icons/OpenInNewOutlined";

const Wrapper = styled.aside`
  /* todo: increase mobile perspective */
  perspective: 800px;
  @media (max-width: 540px) {
    perspective: 600px;
  }
  .listRoot {
    transform: rotateY(90deg) translateZ(-200px) translateX(50px);
  }
  &.enter {
    .listRoot {
      transform: rotateY(0) translateX(-5px) translateZ(0);
    }
  }
  .listRoot {
    --grey: rgba(100, 100, 200, 0.09);
    --lightgreyborder: 3px solid rgba(114, 114, 114, 0.9);
    padding: 0;
    background: var(--grey);
    position: sticky;
    top: 0;
    height: 99.9vh;
    max-height: 99.9vh;
    overflow-y: hidden;
    overflow-x: hidden;
    transition: all 0.5s ease-in-out;
    display: grid;
    /* listRoot > ul > listItem > projectLink + badges */
    .ul {
      height: 100%;
      margin: 0;
      margin-left: 0px;
      &:first-child {
        display: grid;
        grid-template-rows: repeat(auto-fit, minmax(100px, 1fr));
        .listItem {
          display: grid;
          grid-template-rows: repeat(auto-fit, auto);
          grid-gap: 0px;
          justify-items: start;
          align-content: space-evenly;
          padding: 0 0 0 4px;
          margin: 0;
          transition: all ease-in-out 0.15s;
          .projectLink {
            cursor: default;
            border: none;
            background: none;
            padding-left: 16px;
            margin-bottom: 5px;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            font-size: 14px;
            text-align: left;
            text-transform: none;
            text-decoration: none;
            color: #eaeaea;
            &:hover {
              background-color: rgba(0, 0, 0, 0);
            }
          }
          div.actionButtons {
            transition: all 0.15s ease-in-out;
            transform: translateX(0px);
          }
          &.glow {
            div.actionButtons {
              transform: translateX(-5px);
            }
            box-sizing: border-box;
            transform: translateX(5px);
            border-left: 5px solid #ffca2d;
            /* margin-right: -10px; */
            background: rgba(255, 255, 255, 0.1);
            .projectLink {
              text-decoration: underline;
            }
          }
          &.selected {
            color: black;
          }
          .badges {
            padding-left: 16px;
            display: grid;
            grid-template-rows: 24px;
            grid-auto-flow: column;
            grid-column-gap: 5px;
            justify-items: center;
            justify-content: center;
          }
        }
      }
    }
    width: 255px;
    @media (max-width: 540px) {
      width: 200px;
      .listItem {
        padding: 0;
      }
    }
  }
`;

const ActionButtons = styled.div`
  height: 0px;
  opacity: 0;
  transition: all 0.1s ease-in-out;
  pointer-events: none;
  &.visible {
    pointer-events: auto;
    margin-top: 10px;
    height: 38px;
    opacity: 1;
  }
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  margin-left: 18px;
  @media (max-width: 540px) {
    grid-gap: 0px;
    margin-left: 5px;
    button {
      transform: scale(0.9);
    }
    span {
      font-size: 12px;
      svg {
        transform: scale(0.8);
      }
    }
  }
  button {
    cursor: pointer;
    padding: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    &.btnMoreInfo {
      border: 1px solid rgba(63, 81, 181, 0.5);
    }
    &.btnVisitSite {
      border: 1px solid rgba(245, 0, 87, 0.5);
      &:hover {
        background: rgba(245, 0, 87, 0.08);
      }
    }
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    border-radius: 4px;
    width: 105px;
    height: 38px;
    text-transform: none;
    background: rgba(255, 255, 255, 0.08);
    color: lightpink;
    border: 1px solid rgba(245, 0, 87, 0.5);
    svg {
      fill: lightpink;
    }
    &:first-child {
      text-decoration: underline;
      color: #569cd6;
      border: 1px solid rgba(63, 81, 181, 0.5);
      svg {
        fill: #569cd6;
      }
      &:hover {
        background: #00008033;
      }
    }
    span {
      align-items: center;
      place-content: center center;
      svg {
        height: 24px;
        color: inherit;
        margin-top: -1px;
        margin-right: -2px;
      }
      display: grid;
      grid-gap: 2px;
      grid-template-columns: auto auto;
    }
  }
`;

const styles = {};

class ProjectsList extends Component {
  state = {
    visibleButtonsID: null,
  };

  componentDidMount() {
    const listItems = Array.from(document.querySelectorAll(".listItem"));

    listItems.forEach(item => {
      item.addEventListener("mouseover", this.highlightProject);
      item.addEventListener("mouseout", this.unhighlightProject);
    });
  }
  highlightProject(e) {
    // remove all glow
    document.querySelectorAll(".glow").forEach(item => {
      item.classList.remove("glow");
    });
    document
      .querySelectorAll(".projectCircle")
      .forEach(circle => (circle.style.filter = null));

    // add glow to list item
    const listItem = e.path.find(d => d.id.includes("listItem"));
    listItem.classList.add("glow");
    // add glow to node
    const circleID = listItem.id.slice("listItem_".length);
    document.getElementById(`circle_${circleID}`) &&
      (document.getElementById(`circle_${circleID}`).style.filter =
        "url(#glow)");
  }
  unhighlightProject(e) {
    const listItem = e.path.find(d => d.id.includes("listItem"));
    listItem.classList.remove("glow");

    const circleID = listItem.id.slice("listItem_".length);
    document.getElementById(`circle_${circleID}`) &&
      (document.getElementById(`circle_${circleID}`).style.filter = null);
  }
  handleNavigate = path => {
    // add swoosh animation then navigate
    const projectsGrid = document.getElementById("projectsGrid");
    projectsGrid.addEventListener("transitionend", () => navigateTo(path));
    projectsGrid.classList.add("swoosh");
  };
  render() {
    const { projects, classes, popup, moreInfo, visibleButtonsID } = this.props;

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const years = projects.map(p => p.frontmatter.year).filter(onlyUnique);

    return (
      <Wrapper className={popup && "enter"}>
        {/* listRoot > ul > listItem > projectLink + badges */}
        <List className={"listRoot"}>
          <ul className="ul" style={{ margin: "0" }}>
            {projects
              .sort((a, b) => a.frontmatter.id < b.frontmatter.id)
              .map(project => (
                <ListItem
                  key={JSON.stringify(project)}
                  divider={true}
                  className="listItem"
                  id={`listItem_${project.frontmatter.id}`}
                  data-circle={`circle_${project.frontmatter.id}`}
                  onClick={() => {
                    this.props.onChangeVisibility(project.frontmatter.id);
                  }}
                >
                  <Button
                    className="projectLink"
                    disableRipple={true}
                    disableTouchRipple={true}
                  >
                    {project.frontmatter.title}
                  </Button>
                  <Typography className="badges" variant="caption">
                    {project.frontmatter.tools.map(tool => {
                      return <SvgIcons key={tool.toString()} tool={tool} />;
                    })}
                  </Typography>
                  <ActionButtons
                    className={`${visibleButtonsID === project.frontmatter.id &&
                      `visible`} actionButtons`}
                    id={`actionButtons_${project.frontmatter.id}`}
                  >
                    <Button
                      onClick={() =>
                        this.handleNavigate(project.frontmatter.path)
                      }
                      role="link"
                    >
                      <span>More Info</span>
                      <InfoIcon />
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(project.frontmatter.website, "_blank")
                      }
                    >
                      <span>Visit Site</span>
                      <OpenIcon />
                    </Button>
                  </ActionButtons>
                </ListItem>
              ))}
          </ul>
        </List>
      </Wrapper>
    );
  }
}

export default withStyles(styles)(ProjectsList);
