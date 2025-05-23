"""
FastAPI Backend Server for Contribution Viewer

This module implements a REST API for serving contribution data with filtering, 
sorting, and pagination capabilities. It uses FastAPI for the web framework and
loads contribution data from a JSON file.
"""
import json
import re
from contextlib import asynccontextmanager
from enum import Enum
from typing import Optional, List

from fastapi import FastAPI, Query

# In-memory data store for contributions
# Used instead of a database for simplicity in this exercise
DATA = {}


"""
Application Lifecycle Manager

This context manager handles the application startup and shutdown.
On startup: Loads contribution data from JSON file into memory
On shutdown: Clears the data from memory
"""
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load data on startup
    with open('seed_data/contributions.json') as f:
        DATA['contribution_data'] = json.load(f)['contributions']
    yield  # Application runs here
    # Clean up on shutdown
    DATA.clear()


# Create FastAPI app with lifespan manager
app = FastAPI(lifespan=lifespan)


"""
Root endpoint that returns a welcome message
"""
@app.get("/")
async def root():
    return {"message": "Arqiva Tech Test 1 -  Good Luck!"}


"""
Enum for contribution sorting options

Defines valid fields that can be used for ordering contributions in API responses.
"""
class ContributionOrder(str, Enum):
    id = "id"
    title = "title"
    description = "description"
    startTime = "startTime"
    endTime = "endTime"
    owner = "owner"


"""
Enum for filter matching strategy

Defines how multiple filters should be combined:
- any: Match contributions that satisfy any of the filters (OR logic)
- all: Match contributions that satisfy all of the filters (AND logic)
"""
class MatchType(str, Enum):
    any = "any"
    all = "all"


"""
Enum for contribution filter fields

Defines the available filter fields and their matching behavior:
- id: Exact match on contribution ID
- title/description: Case-insensitive substring match
- time filters: Compare against ISO 8601 datetime strings
- owner: Case-insensitive substring match
- match: Determines how multiple filters are combined
"""
class ContributionFilter(str, Enum):
    id: Optional[str]  # equals
    title: Optional[str]  # contains
    description: Optional[str]  # contains
    startBefore: Optional[str]
    startAfter: Optional[str]
    endBefore: Optional[str]
    endAfter: Optional[str]
    owner: Optional[str]  # equals
    match: Optional[MatchType]


"""
Helper function to extract IDs from a list of contribution dictionaries
"""
def _ids(l: list):
    return [i['id'] for i in l]


"""
List Contributions Endpoint

Retrieves a filtered, sorted, and paginated list of contributions.
Supports multiple filter criteria that can be combined with AND/OR logic.
"""
@app.get("/contributions/")
async def list_contributions(
    # Pagination parameters
    skip: int = 0,  # Number of items to skip (for pagination)
    limit: int = 30,  # Maximum number of items to return

    # Sorting parameter
    order_by: ContributionOrder = Query(default=ContributionOrder.id),

    # Filter parameters
    id: Optional[List[str]] = Query(None),  # Filter by specific IDs
    owner: Optional[str] = Query(None),  # Filter by owner (case-insensitive)
    title: Optional[str] = Query(None),  # Filter by title (case-insensitive)
    description: Optional[str] = Query(None),  # Filter by description (case-insensitive)
    startBefore: Optional[str] = Query(None),  # Filter by start time before
    startAfter: Optional[str] = Query(None),  # Filter by start time after
    endBefore: Optional[str] = Query(None),  # Filter by end time before
    endAfter: Optional[str] = Query(None),  # Filter by end time after

    # Filter combination logic
    match: MatchType = Query(default=MatchType.all)  # How to combine filters (AND/OR)
):
    """
    Retrieve contributions with filtering, sorting, and pagination.

    The function applies all specified filters to the contributions data and returns
    a paginated subset of the matching contributions.
    """
    # Get all contributions from the data store
    contributions: list = DATA['contribution_data']

    # Initialize ID lists for filtering
    # For 'any' match type, start with empty list (will be populated with matches)
    # For 'all' match type, start with all IDs (will be filtered down)
    all_ids = [] if match == MatchType.any else _ids(contributions)
    matching_ids = all_ids
    matching_title = all_ids
    matching_description = all_ids
    matching_owner = all_ids
    matching_start_before = all_ids
    matching_start_after = all_ids
    matching_end_before = all_ids
    matching_end_after = all_ids

    # Apply ID filter if provided
    if id:
        matching_ids = _ids(list(filter(lambda c: c['id'] in [int(i) for i in id], contributions)))
        print("IDs :", matching_ids)

    # Apply title filter if provided (case-insensitive substring match)
    if title:
        matching_title = _ids(list(filter(lambda c: re.search(title, c['title'], re.IGNORECASE), contributions)))
        print("Title :", matching_title)

    # Apply description filter if provided (case-insensitive substring match)
    if description:
        matching_description = _ids(
            list(filter(lambda c: re.search(description, c['description'], re.IGNORECASE), contributions)))
        print("Desc :", matching_description)

    # Apply owner filter if provided (case-insensitive substring match)
    if owner:
        matching_owner = _ids(list(filter(lambda c: re.search(owner, c['owner'], re.IGNORECASE), contributions)))
        print("Owner :", matching_owner)  # Fixed label from "Desc" to "Owner"

    # Apply startBefore filter if provided (date comparison)
    if startBefore:
        matching_start_before = _ids(list(filter(lambda c: c['startTime'] < startBefore, contributions)))
        print("StartBefore :", matching_start_before)

    # Apply startAfter filter if provided (date comparison)
    if startAfter:
        matching_start_after = _ids(list(filter(lambda c: c['startTime'] > startAfter, contributions)))
        print("StartAfter :", matching_start_after)

    # Apply endBefore filter if provided (date comparison)
    if endBefore:
        matching_end_before = _ids(list(filter(lambda c: c['endTime'] < endBefore, contributions)))
        print("EndBefore :", matching_end_before)

    # Apply endAfter filter if provided (date comparison)
    if endAfter:
        matching_end_after = _ids(list(filter(lambda c: c['endTime'] > endAfter, contributions)))
        print("EndAfter :", matching_end_after)

    # Combine all filters according to the match type (any/all)
    matching_contribution_ids = []
    if match == MatchType.any:
        # OR logic: Union of all matching IDs
        matching_contribution_ids = set(
            matching_contribution_ids + matching_ids + matching_title + matching_description + matching_start_before +
            matching_start_after + matching_end_before + matching_end_after + matching_owner)
    else:  # all
        # AND logic: Intersection of all matching IDs
        matching_contribution_ids = list(
            set(matching_ids) & set(matching_title) & set(matching_description) & set(matching_start_before) & set(
                matching_start_after) & set(matching_end_before) & set(matching_end_after) & set(matching_owner))

    # Get the full contribution objects for the matching IDs
    matching_contributions = [c for c in contributions if c['id'] in matching_contribution_ids]

    # Apply sorting if specified
    if order_by:
        matching_contributions = sorted(matching_contributions, key=lambda contribution: contribution[order_by])

    # Apply pagination
    paginated_contributions = matching_contributions[skip:skip + limit]

    # Return paginated results with metadata
    return {
        "contributions": paginated_contributions,  # The paginated subset of contributions
        "total": len(matching_contributions),      # Total number of matching contributions (before pagination)
        "skip": skip,                              # Number of items skipped (for pagination)
        "limit": limit                             # Maximum number of items returned
    }
