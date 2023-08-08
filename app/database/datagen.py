

n = 100


with open('data.sql', 'w') as f:

  for i in range(1, n+1):
    f.write(f"INSERT INTO books(title, author, loaner, notes) VALUES('title-{i}', 'author-{i}', 'loaner-{i}', 'these are notes {i}');\n",)
